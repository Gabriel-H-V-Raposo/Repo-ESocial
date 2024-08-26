import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { organizationSchema } from "@saas/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { getUserPermissions } from "@/lib/get-user-permissions";

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/orgs/create-organization/:slug",
      {
        schema: {
          tags: ["Organizations"],
          summary: "Shutdown organization",
          security: [{ bearerAuth: [] }],
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

        if (cannot("delete", authOrganization)) {
          throw new UnauthorizedError(
            "You're not allowed to shutdown this organization"
          );
        }

        await prisma.organization.delete({
          where: {
            id: organization.id,
          },
        });

        return reply.status(204).send();
      }
    );
}
