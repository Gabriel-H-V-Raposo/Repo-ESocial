import { api } from "./api-client";

interface GetOrganizationResponse {
  organizations: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
  }[];
}

export async function getOrganization() {
  const result = await api
    .get("orgs/organizations")
    .json<GetOrganizationResponse>();

  return result;
}
