import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { createSlug } from "@/lib/create-slug";
import { request } from "http";

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/orgs/create-organization",
      {
        schema: {
          tags: ["Organizations"],
          summary: "Create new organization",
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullable(),
            shouldAttachUserByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { name, domain, shouldAttachUserByDomain } = request.body;

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: {
              domain,
            },
          });

          if (organizationByDomain) {
            throw new BadRequestError(
              "Organization with this domain already exists"
            );
          }
        }

        const organization = await prisma.organization.create({
          data: {
            name,
            slug: createSlug(name),
            domain: domain || null,
            shouldAttachUserByDomain,
            ownerId: userId,
            members: {
              create: {
                userId,
                role: "ADMIN",
              },
            },
          },
        });

        return reply.status(201).send({ organizationId: organization.id });
      }
    );
}
