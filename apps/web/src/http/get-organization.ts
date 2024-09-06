import { api } from "./api-client";

interface GetOrganizationResponse {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export async function getOrganization() {
  const result = await api
    .get("orgs/organizations")
    .json<GetOrganizationResponse>();

  return result;
}
