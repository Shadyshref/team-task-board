import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addProjectMember,
  listProjectMembers,
  removeProjectMember,
} from "@/lib/api/project-members";
import type { AddProjectMemberInput } from "@/types/api";

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => listProjectMembers(projectId),
    enabled: Boolean(projectId),
  });
}

type AddProjectMemberVariables = {
  projectId: string;
  input: AddProjectMemberInput;
};

export function useAddProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, input }: AddProjectMemberVariables) =>
      addProjectMember(projectId, input),
    onSuccess: async (_member, { projectId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-members", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-summary", projectId] }),
      ]);
    },
  });
}

type RemoveProjectMemberVariables = {
  projectId: string;
  userId: string;
};

export function useRemoveProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, userId }: RemoveProjectMemberVariables) =>
      removeProjectMember(projectId, userId),
    onSuccess: async (_result, { projectId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-members", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-summary", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}
