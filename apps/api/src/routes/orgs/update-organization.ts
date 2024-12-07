import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { organizationSchema } from "@saas/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { getUserPermissions } from "@/lib/get-user-permissions";

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/orgs/organization/:slug",
      {
        schema: {
          tags: ["Organizations"],
          summary: "Update organization details",
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string().optional(),
            domain: z.string().optional(),
            shouldAttachUserByDomain: z.boolean().optional(),
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

        const { name, domain, shouldAttachUserByDomain } = request.body;

        const authOrganization = organizationSchema.parse(organization);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("update", authOrganization)) {
          throw new UnauthorizedError(
            "You're not allowed to update this organization"
          );
        }

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: {
              domain,
              id: { not: organization.id },
            },
          });

          if (organizationByDomain) {
            throw new BadRequestError(
              "Organization with this domain already exists"
            );
          }
        }

        await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            name,
            domain,
            shouldAttachUserByDomain,
          },
        });

        return reply.status(204).send();
      }
    );
}
