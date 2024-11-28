import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3334),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),

    GITHUB_OAUTH_CLIENT_ID: z.string(),
    GITHUB_OAUTH_CLIENT_SECRET: z.string(),
    GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.string().url(),

    GOOGLE_OAUTH_CLIENT_ID: z.string().nullable(),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string().nullable(),
    GOOGLE_OAUTH_CLIENT_REDIRECT_URI: z.string().url().nullable(),
  },
  client: {},
  shared: {
    NODE_ENV: z.string().default("dev"),
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: process.env.PORT ?? 3334,
    DATABASE_URL:
      process.env.DATABASE_URL ??
      "postgresql://docker:docker@localhost:5439/next-saas?schema=public",
    JWT_SECRET:
      process.env.JWT_SECRET ??
      "T!l9xW@uS8#1K$BvQz%6rC&nE*4mP-YgX2jH(5L)pO7^0FZ+A|>3vJ{~`dM=_8uV?N<cI:sR",

    GITHUB_OAUTH_CLIENT_ID:
      process.env.GITHUB_OAUTH_CLIENT_ID ?? "Ov23liZSsH0yF3j0vy7Z",
    GITHUB_OAUTH_CLIENT_SECRET:
      process.env.GITHUB_OAUTH_CLIENT_SECRET ??
      "f974cc2b74ac64e5688e8cf90cda1359364ddb35",
    GITHUB_OAUTH_CLIENT_REDIRECT_URI:
      process.env.GITHUB_OAUTH_CLIENT_REDIRECT_URI ??
      "http://localhost:3000/api/auth/callback",

    GOOGLE_OAUTH_CLIENT_ID:
      process.env.GOOGLE_OAUTH_CLIENT_ID ?? "your-google-client-id",
    GOOGLE_OAUTH_CLIENT_SECRET:
      process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "your-google-client-secret",
    GOOGLE_OAUTH_CLIENT_REDIRECT_URI:
      process.env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI ??
      "http://localhost:3000/api/auth/callback",

    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3334/",
  },
  emptyStringAsUndefined: true,
});
