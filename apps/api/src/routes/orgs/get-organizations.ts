import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { Role } from "@prisma/client";

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/orgs/organizations",
      {
        schema: {
          tags: ["Organizations"],
          summary: "Get organization where user is a member",
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: z.nativeEnum(Role),
                })
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId();

        const organizations = await prisma.organization.findMany({
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            members: {
              where: {
                userId,
              },
              select: {
                role: true,
              },
            },
          },
        });

        const organizationsWithUserRole = organizations.map(
          ({ members, ...orgs }) => {
            return {
              ...orgs,
              role: members[0].role,
            };
          }
        );

        return {
          organizations: organizationsWithUserRole,
        };
      }
    );
}
