import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { env } from "@saas/env";

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/auth/authenticate-with-github",
    {
      schema: {
        tags: ["Auth"],
        summary: "Authenticate with github",
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

      const githubAuthUrl = new URL(
        "htttps://github.com/login/oauth/access_token"
      );

      githubAuthUrl.searchParams.set("client_id", env.GITHUB_OAUTH_CLIENT_ID);
      githubAuthUrl.searchParams.set(
        "client_secret",
        env.GITHUB_OAUTH_CLIENT_SECRET
      );
      githubAuthUrl.searchParams.set(
        "redirect_url",
        env.GITHUB_OAUTH_CLIENT_REDIRECT_URI
      );
      githubAuthUrl.searchParams.set("code", code);

      const githubAccessTokenResponse = await fetch(githubAuthUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      const githubAccessTokenData = await githubAccessTokenResponse.json();

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal("bearer"),
          scope: z.string(),
        })
        .parse(githubAccessTokenData);

      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      });

      const githubUserData = await githubUserResponse.json();

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          id: z.number().int().transform(String),
          avatar_url: z.string().url(),
          email: z.string().email().nullable(),
          name: z.string().nullable(),
        })
        .parse(githubUserData);

      if (!email) {
        throw new BadRequestError(
          "Your email is not public on github or not provided"
        );
      }

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
            provider: "GITHUB",
            userId: user.id,
          },
        },
      });

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: "GITHUB",
            providerAccountId: githubId,
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
            expiresIn: "7d",
          },
        }
      );

      return reply.status(201).send({ token });
    }
  );
}
