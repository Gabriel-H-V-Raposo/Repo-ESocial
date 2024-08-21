import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/auth/request-password-recover",
    {
      schema: {
        tags: ["Auth"],
        summary: "Request password recover",
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (!userFromEmail) {
        // We don't want to leak information about whether the user exists or not
        return reply.status(201).send();
      }

      const { id: code } = await prisma.token.create({
        data: {
          type: "PASSWORD_RECOVER",
          userId: userFromEmail.id,
        },
      });

      //TODO: Send email with the code

      console.log("Password recover code:", code);

      return reply.status(201).send();
    }
  );
}
