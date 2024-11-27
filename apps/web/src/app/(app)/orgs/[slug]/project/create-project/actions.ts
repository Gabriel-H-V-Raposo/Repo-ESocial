"use server";

import { z } from "zod";
import { HTTPError } from "ky";
import { createProject } from "@/http/create-project";
import { getCurrentOrg } from "@/auth/auth";
import { revalidateTag } from "next/cache";

const projectSchema = z.object({
  name: z.string().min(4, { message: "Name must be at least 4 characters" }),
  description: z.string(),
});

export async function createProjectAction(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data));
  const org = getCurrentOrg()!;

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { description, name } = result.data;

  try {
    await createProject({
      name,
      description,
      slug: org,
    });
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();

      return { success: false, message, errors: null };
    }

    console.error(err);

    revalidateTag(`${org}/projects`);

    return { success: false, message: "Unexpected error", errors: null };
  }

  return {
    success: true,
    message: "Successfully save project",
    errors: null,
  };
}
