import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getTask,
  listProjectTasks,
  updateTask,
} from "@/lib/api/tasks";
import type { CreateTaskInput, TaskFilters, UpdateTaskInput } from "@/types/api";

export function useProjectTasks(projectId: string, filters: TaskFilters) {
  return useQuery({
    queryKey: ["project-tasks", projectId, filters],
    queryFn: () => listProjectTasks(projectId, filters),
    enabled: Boolean(projectId),
  });
}

export function useTask(projectId: string, taskId: string) {
  return useQuery({
    queryKey: ["project-task", projectId, taskId],
    queryFn: () => getTask(projectId, taskId),
    enabled: Boolean(projectId && taskId),
  });
}

type CreateTaskVariables = {
  projectId: string;
  input: CreateTaskInput;
};

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, input }: CreateTaskVariables) =>
      createTask(projectId, input),
    onSuccess: async (_task, { projectId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-summary", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}

type UpdateTaskVariables = {
  projectId: string;
  taskId: string;
  input: UpdateTaskInput;
};

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskId, input }: UpdateTaskVariables) =>
      updateTask(projectId, taskId, input),
    onSuccess: async (_task, { projectId, taskId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-task", projectId, taskId] }),
        queryClient.invalidateQueries({ queryKey: ["project-summary", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}

type DeleteTaskVariables = {
  projectId: string;
  taskId: string;
};

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskId }: DeleteTaskVariables) =>
      deleteTask(projectId, taskId),
    onSuccess: async (_result, { projectId, taskId }) => {
      queryClient.removeQueries({
        queryKey: ["project-task", projectId, taskId],
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["project-summary", projectId] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}
