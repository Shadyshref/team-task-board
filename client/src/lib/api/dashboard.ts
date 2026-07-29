import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ApiSuccess,
  DashboardSummary,
  ProjectSummary,
} from "@/types/api";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await apiClient.get<ApiSuccess<{ summary: DashboardSummary }>>(
    API_ENDPOINTS.dashboard.summary,
  );

  return response.data.data.summary;
}

export async function getProjectSummary(
  projectId: string,
): Promise<ProjectSummary> {
  const response = await apiClient.get<ApiSuccess<{ summary: ProjectSummary }>>(
    API_ENDPOINTS.projects.summary(projectId),
  );

  return response.data.data.summary;
}
