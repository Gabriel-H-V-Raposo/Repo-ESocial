import { api } from "./api-client";

interface UpdateProjectRequest {
  name: string | undefined;
  description: string | undefined;
  content: {} | undefined;
  org: string;
  project: string;
}

export async function updateProject({
  content,
  description,
  name,
  org,
  project,
}: UpdateProjectRequest) {
  await api.put(`/${org}/projects/${project}/project`, {
    json: { content, description, name },
  });
}
