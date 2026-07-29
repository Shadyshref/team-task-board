import { useQuery } from "@tanstack/react-query";

import {
  getDashboardSummary,
  getProjectSummary,
} from "@/lib/api/dashboard";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });
}

export function useProjectSummary(projectId: string) {
  return useQuery({
    queryKey: ["project-summary", projectId],
    queryFn: () => getProjectSummary(projectId),
    enabled: Boolean(projectId),
  });
}
