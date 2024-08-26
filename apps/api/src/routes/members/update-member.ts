import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/lib/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { roleSchema } from "@saas/auth";

export async function updateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/:slug/update-member/:memberId",
      {
        schema: {
          tags: ["Members"],
          summary: "Update a member",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          body: z.object({
            role: roleSchema,
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } =
          await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("update", "User")) {
          throw new UnauthorizedError(
            "You're not allowed to update this member"
          );
        }

        const { role } = request.body;

        await prisma.member.update({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
          data: {
            role,
          },
        });

        return reply.code(204).send();
      }
    );
}

// userId: string;
// id: string;
// role: $Enums.Role;
// name: string | null;
// avatarUrl: string | null;
// email: string;
