import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { env } from "@saas/env";

export async function authenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/auth/authenticate-with-google",
    {
      schema: {
        tags: ["Auth"],
        summary: "Authenticate with Google",
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body;

      // Construir a URL para troca do code pelo token de acesso
      const googleAuthUrl = new URL("https://oauth2.googleapis.com/token");

      // Adicionar parâmetros necessários
      googleAuthUrl.searchParams.set("client_id", env.GOOGLE_OAUTH_CLIENT_ID);
      googleAuthUrl.searchParams.set("client_secret", env.GOOGLE_OAUTH_CLIENT_SECRET);
      googleAuthUrl.searchParams.set("redirect_uri", env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI);
      googleAuthUrl.searchParams.set("grant_type", "authorization_code");
      googleAuthUrl.searchParams.set("code", code);

      // Solicitar o token de acesso
      const googleAccessTokenResponse = await fetch(googleAuthUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const googleAccessTokenData = await googleAccessTokenResponse.json();

      const { access_token: googleAccessToken } = z
        .object({
          access_token: z.string(),
          expires_in: z.number(),
          token_type: z.literal("Bearer"),
          scope: z.string(),
          id_token: z.string().optional(),
        })
        .parse(googleAccessTokenData);

      // Buscar dados do usuário com o token de acesso
      const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      });

      const googleUserData = await googleUserResponse.json();

      const {
        id: googleId,
        name,
        email,
        picture: avatarUrl,
      } = z
        .object({
          id: z.string(),
          email: z.string().email(),
          name: z.string().nullable(),
          picture: z.string().url().nullable(),
        })
        .parse(googleUserData);

      // Verificar se o usuário já existe
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            avatarUrl,
          },
        });
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: "GOOGLE",
            userId: user.id,
          },
        },
      });

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: "GOOGLE",
            providerAccountId: googleId,
            userId: user.id,
          },
        });
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: "30d",
          },
        }
      );

      return reply.status(201).send({ token });
    }
  );
}
