import { Role } from "@saas/auth";
import { api } from "./api-client";

interface CreateInviteRequest {
  email: string;
  role: Role;
  slug: string;
}

type CreateInviteResponse = void;

export async function createInvite({
  email,
  role,
  slug,
}: CreateInviteRequest): Promise<CreateInviteResponse> {
  await api.post(`${slug}/invites/create-invite`, {
    json: {
      email,
      role,
    },
  });
}
