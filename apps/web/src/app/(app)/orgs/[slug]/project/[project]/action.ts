"use server";

import { z } from "zod";
import { HTTPError } from "ky";
import { getCurrentOrg } from "@/auth/auth";
import { revalidateTag } from "next/cache";
import { updateProject } from "@/http/update-project";

const updateProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  content: z.object({}).passthrough().optional(),
  project: z.string(),
});

export async function updateProjectAction(data: FormData) {
  const result = updateProjectSchema.safeParse(Object.fromEntries(data));
  const org = getCurrentOrg()!;

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { description, name, content, project } = result.data;

  try {
    await updateProject({
      name,
      description,
      content,
      org,
      project,
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
