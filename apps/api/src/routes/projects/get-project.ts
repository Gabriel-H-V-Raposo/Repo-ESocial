import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/lib/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/:slugOrg/projects/:slugProject/get-project",
      {
        schema: {
          tags: ["Projects"],
          summary: "Get project by slug and organization",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slugOrg: z.string(),
            slugProject: z.string(),
          }),
          response: {
            200: z.object({
              project: z.object({
                id: z.string().uuid(),
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.string().nullable(),
                ownerId: z.string().uuid(),
                organizationId: z.string(),
                description: z.string().nullable(),
                owner: z.object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slugOrg, slugProject } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } =
          await request.getUserMembership(slugOrg);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("get", "Project")) {
          throw new UnauthorizedError("You're not allowed to see this project");
        }

        const project = await prisma.project.findUnique({
          where: {
            slug: slugProject,
            organizationId: organization.id,
          },
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        });

        if (!project) {
          throw new BadRequestError("Project not found");
        }

        return reply.send({ project });
      }
    );
}
