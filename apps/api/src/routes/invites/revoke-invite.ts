import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/lib/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function revokeInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/:slug/invites/revoke-invite/:inviteId",
      {
        schema: {
          tags: ["Invites"],
          summary: "Create new invite",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            inviteId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, inviteId } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } =
          await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("delete", "Invite")) {
          throw new UnauthorizedError("You're not allowed to delete an invite");
        }

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
            organizationId: organization.id,
          },
        });

        if (!invite) {
          throw new BadRequestError("Invite not found or expired");
        }

        await prisma.invite.delete({
          where: {
            id: inviteId,
          },
        });

        reply.code(204).send();
      }
    );
}
