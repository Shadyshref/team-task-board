import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "@/lib/api/projects";
import type { CreateProjectInput, UpdateProjectInput } from "@/types/api";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getProject(projectId),
    enabled: Boolean(projectId),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}

type UpdateProjectVariables = {
  projectId: string;
  input: UpdateProjectInput;
};

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, input }: UpdateProjectVariables) =>
      updateProject(projectId, input),
    onSuccess: async (_project, { projectId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
      ]);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: async (_result, projectId) => {
      queryClient.removeQueries({ queryKey: ["projects", projectId] });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}
