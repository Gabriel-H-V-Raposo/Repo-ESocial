import { api } from "./api-client";

interface GetProjectResponse {
  project: {
    name: string;
    id: string;
    slug: string;
    avatarUrl: string | null;
    ownerId: string;
    organizationId: string;
    description: string | null;
    owner: {
      name: string | null;
      id: string;
      avatarUrl: string | null;
    };
  };
}

export async function getProject(org: string, project: string) {
  const result = await api
    .get(`/${org}/projects/${project}/get-project`, {
      next: { tags: ["project"] },
    })
    .json<GetProjectResponse>();

  return result;
}
