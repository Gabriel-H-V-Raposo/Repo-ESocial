import { api } from "./api-client";

interface UpdateOrganizationRequest {
  org: string;
  name: string;
  domain: string | null;
  shouldAttachUserByDomain: boolean;
}

type UpdateOrganizationResponse = void;

export async function updateOrganization({
  name,
  domain,
  shouldAttachUserByDomain,
  org,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  await api.put(`/orgs/organization/${org}`, {
    json: {
      name,
      domain,
      shouldAttachUserByDomain,
    },
  });
}
