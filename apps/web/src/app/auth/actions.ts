"use server";

import { redirect } from "next/navigation";

export async function signInWithGithub() {
  const githubSignInURL = new URL(
    "login/oauth/authorize",
    "https://github.com"
  );

  githubSignInURL.searchParams.set("client_id", "Ov23liZSsH0yF3j0vy7Z");
  githubSignInURL.searchParams.set(
    "redirect_url",
    "http://localhost:3000/api/auth/callback"
  );
  githubSignInURL.searchParams.set("scope", "user");

  redirect(githubSignInURL.toString());
}
