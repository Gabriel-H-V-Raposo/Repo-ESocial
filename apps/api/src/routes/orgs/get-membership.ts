import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Role } from "@prisma/client";
import z from "zod";

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/orgs/:slug/membership",
      {
        schema: {
          tags: ["Organizations"],
          summary: "Get user membership on organization",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().uuid(),
                role: z.nativeEnum(Role),
                organizationId: z.string(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = await request.params;
        const { membership } = await request.getUserMembership(slug);

        return {
          membership: {
            id: membership.id,
            role: membership.role,
            organizationId: membership.organizationId,
          },
        };
      }
    );
}
