import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/lib/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { roleSchema } from "@saas/auth";

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/:slug/members",
      {
        schema: {
          tags: ["Members"],
          summary: "Get all organization members",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.string().uuid(),
                  userId: z.string().uuid(),
                  role: roleSchema,
                  name: z.string().nullable(),
                  email: z.string().email(),
                  avatarUrl: z.string().nullable(),
                })
              ),
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

        if (cannot("get", "User")) {
          throw new UnauthorizedError(
            "You're not allowed to see organization members"
          );
        }

        const members = await prisma.member.findMany({
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            role: "asc",
          },
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        });

        const membersWithRole = members.map(
          ({ user: { id: userId, ...user }, ...member }) => {
            return {
              ...user,
              ...member,
              userId,
            };
          }
        );

        return reply.send({ members: membersWithRole });
      }
    );
}

// userId: string;
// id: string;
// role: $Enums.Role;
// name: string | null;
// avatarUrl: string | null;
// email: string;
