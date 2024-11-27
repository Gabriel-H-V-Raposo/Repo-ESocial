import { api } from "./api-client";

interface CreateProjectRequest {
  slug: string;
  name: string;
  description: string;
}

type CreateProjectResponse = void;

export async function createProject({
  name,
  description,
  slug,
}: CreateProjectRequest): Promise<CreateProjectResponse> {
  await api.post(`${slug}/projects/create-project`, {
    json: {
      name,
      description,
    },
  });
}
