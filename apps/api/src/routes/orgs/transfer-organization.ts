import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { organizationSchema } from "@saas/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { getUserPermissions } from "@/lib/get-user-permissions";

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      "/orgs/create-organization/:slug/owner",
      {
        schema: {
          tags: ["Organizations"],
          summary: "transfer organization ownership",
          security: [{ bearerAuth: [] }],
          body: z.object({
            transferToUserId: z.string().uuid(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { slug } = await request.params;

        const { membership, organization } =
          await request.getUserMembership(slug);

        const authOrganization = organizationSchema.parse(organization);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("transfer_ownership", authOrganization)) {
          throw new UnauthorizedError(
            "You're not allowed to transfer ownership of this organization"
          );
        }

        const { transferToUserId } = request.body;

        const transferToMembership = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
        });

        if (!transferToMembership) {
          throw new BadRequestError(
            "Target user is not a member of this organization"
          );
        }

        await prisma.$transaction([
          prisma.member.update({
            where: {
              organizationId_userId: {
                organizationId: organization.id,
                userId: transferToUserId,
              },
            },
            data: {
              role: "ADMIN",
            },
          }),
          prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              ownerId: transferToUserId,
            },
          }),
        ]);

        return reply.status(204).send();
      }
    );
}