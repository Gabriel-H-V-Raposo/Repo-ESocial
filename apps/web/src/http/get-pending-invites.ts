import { Role } from "@saas/auth";
import { api } from "./api-client";

interface GetInvitesPendingResponse {
  invites: {
    organization: {
      name: string;
    };
    id: string;
    createdAt: string;
    role: Role;
    email: string;
    author: {
      name: string | null;
      id: string;
      avatarUrl: string | null;
    } | null;
  }[];
}

export async function getInvitesPending() {
  const result = await api
    .get(`invites/pending-invites`)
    .json<GetInvitesPendingResponse>();

  console.log("fiz uma requisição", result);

  return result;
}
