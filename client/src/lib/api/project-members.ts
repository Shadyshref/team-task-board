import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  AddProjectMemberInput,
  ApiSuccess,
  ProjectMember,
} from "@/types/api";

export async function listProjectMembers(
  projectId: string,
): Promise<ProjectMember[]> {
  const response = await apiClient.get<ApiSuccess<{ members: ProjectMember[] }>>(
    API_ENDPOINTS.projects.members(projectId),
  );

  return response.data.data.members;
}

export async function addProjectMember(
  projectId: string,
  input: AddProjectMemberInput,
): Promise<ProjectMember> {
  const response = await apiClient.post<ApiSuccess<{ member: ProjectMember }>>(
    API_ENDPOINTS.projects.members(projectId),
    input,
  );

  return response.data.data.member;
}

export async function removeProjectMember(
  projectId: string,
  userId: string,
): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.projects.member(projectId, userId));
}
