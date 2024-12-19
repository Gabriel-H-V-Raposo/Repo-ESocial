import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/lib/get-user-permissions";
import { projectSchema } from "@saas/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/:slug/projects/:projectId/project",
      {
        schema: {
          tags: ["Projects"],
          summary: "Update project by slug and organization",
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            content: z.object({}).passthrough().optional(),
          }),
          params: z.object({
            slug: z.string(),
            projectId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } =
          await request.getUserMembership(slug);

        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        });

        if (!project) {
          throw new BadRequestError("Project not found");
        }

        const { cannot } = getUserPermissions(userId, membership.role);
        const authProject = projectSchema.parse(project);

        if (cannot("update", authProject)) {
          throw new UnauthorizedError(
            "You're not allowed to update this project"
          );
        }

        const { name, description } = request.body;

        await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            name,
            description,
          },
        });

        return reply.status(204).send();
      }
    );
}
