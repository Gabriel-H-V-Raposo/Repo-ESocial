"use server";

import { getCurrentOrg } from "@/auth/auth";
import { createInvite } from "@/http/create-invite";
import { removeMember } from "@/http/remove-member";
import { revokeInvite } from "@/http/revoke-invite";
import { updateMember } from "@/http/update-member";
import { Role, roleSchema } from "@saas/auth";
import { HTTPError } from "ky";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email({ message: "Invalid e-mail address" }),
  role: roleSchema,
});

export async function createInviteProjectAction(data: FormData) {
  const result = inviteSchema.safeParse(Object.fromEntries(data));
  const org = getCurrentOrg()!;

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { role, email } = result.data;

  try {
    await createInvite({
      email,
      role,
      slug: org,
    });

    revalidateTag(`${org}/invites`);
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();

      return { success: false, message, errors: null };
    }

    console.error(err);

    return { success: false, message: "Unexpected error", errors: null };
  }

  return {
    success: true,
    message: "Successfully created the invite",
    errors: null,
  };
}

export async function removeMemberAction(memberId: string) {
  const currentOrg = getCurrentOrg();

  await removeMember({ org: currentOrg!, memberId });

  revalidateTag(`${currentOrg}/members`);
}

export async function updateMemberAction(memberId: string, role: Role) {
  const currentOrg = getCurrentOrg();

  await updateMember({ org: currentOrg!, memberId, role });

  revalidateTag(`${currentOrg}/members`);
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = getCurrentOrg();

  await revokeInvite({ inviteId, org: currentOrg! });

  revalidateTag(`${currentOrg}/invites`);
}
