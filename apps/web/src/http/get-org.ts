import { api } from "./api-client";

interface GetOrgResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    shouldAttachUserByDomain: boolean;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
  };
}

export async function getOrg(org: string) {
  const result = await api
    .get(`orgs/organizations/${org}`,

    )
    .json<GetOrgResponse>();

  return result;
}
