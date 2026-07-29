import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ApiSuccess,
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "@/types/api";

export async function listProjects(): Promise<Project[]> {
  const response = await apiClient.get<ApiSuccess<{ projects: Project[] }>>(
    API_ENDPOINTS.projects.list,
  );

  return response.data.data.projects;
}

export async function getProject(projectId: string): Promise<Project> {
  const response = await apiClient.get<ApiSuccess<{ project: Project }>>(
    API_ENDPOINTS.projects.detail(projectId),
  );

  return response.data.data.project;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const response = await apiClient.post<ApiSuccess<{ project: Project }>>(
    API_ENDPOINTS.projects.list,
    input,
  );

  return response.data.data.project;
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
): Promise<Project> {
  const response = await apiClient.patch<ApiSuccess<{ project: Project }>>(
    API_ENDPOINTS.projects.detail(projectId),
    input,
  );

  return response.data.data.project;
}

export async function deleteProject(
  projectId: string,
): Promise<{ message: string }> {
  const response = await apiClient.delete<ApiSuccess<{ message: string }>>(
    API_ENDPOINTS.projects.detail(projectId),
  );

  return response.data.data;
}
