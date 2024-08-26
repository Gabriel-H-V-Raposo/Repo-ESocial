import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getUserPermissions } from "@/lib/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/:slug/projects",
      {
        schema: {
          tags: ["Projects"],
          summary: "Get all organization projects",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().nullable(),
                  ownerId: z.string().uuid(),
                  organizationId: z.string(),
                  description: z.string().nullable(),
                  createdAt: z.date(),
                  owner: z.object({
                    id: z.string().uuid(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().nullable(),
                  }),
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

        if (cannot("get", "Project")) {
          throw new UnauthorizedError(
            "You're not allowed to see organization projects"
          );
        }

        const projects = await prisma.project.findMany({
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        });

        return reply.send({ projects });
      }
    );
}
