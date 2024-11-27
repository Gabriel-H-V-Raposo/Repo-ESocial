import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/lib/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { roleSchema } from "@saas/auth";

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/:slug/invites/create-invite",
      {
        schema: {
          tags: ["Invites"],
          summary: "Create new invite",
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } =
          await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("create", "Invite")) {
          throw new UnauthorizedError("You're not allowed to create a project");
        }

        const { email, role } = request.body;

        const [, domain] = email.split("@");

        if (
          organization.shouldAttachUserByDomain &&
          domain !== organization.domain
        ) {
          throw new BadRequestError(
            `Users with "${domain}" domain will join your organization on login`
          );
        }

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        });

        if (inviteWithSameEmail) {
          throw new BadRequestError("Invite with this email already exists");
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        });

        if (memberWithSameEmail) {
          throw new BadRequestError("A member with this email already exists");
        }

        const invite = await prisma.invite.create({
          data: {
            organizationId: organization.id,
            email,
            role,
            authorId: userId,
          },
        });

        reply.code(201).send({ inviteId: invite.id });
      }
    );
}
