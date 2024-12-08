"use server";

import { z } from "zod";
import { signInWithPassword } from "@/http/sing-in-with-password";
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { acceptInvite } from "@/http/accept-invite";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { email, password } = result.data;

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    });

    cookies().set("token", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    const inviteId = cookies().get("inviteId")?.value;

    if (inviteId) {
      try {
        await acceptInvite(inviteId);
        cookies().delete("inviteId");
      } catch {}
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();

      return { success: false, message, errors: null };
    }

    console.error(err);

    return { success: false, message: "Unexpected error", errors: null };
  }

  return { success: true, message: null, errors: null };
}
