import { api } from "./api-client";

interface RevokeInviteRequest {
  org: string;
  inviteId: string;
}

export async function rejectInvite({ org, inviteId }: RevokeInviteRequest) {
  await api.delete(`${org}/invites/revoke-invite/${inviteId}`);
}
