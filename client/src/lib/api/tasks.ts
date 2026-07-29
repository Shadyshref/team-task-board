import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ApiSuccess,
  CreateTaskInput,
  Task,
  TaskFilters,
  UpdateTaskInput,
} from "@/types/api";

export async function listProjectTasks(
  projectId: string,
  filters: TaskFilters,
): Promise<Task[]> {
  const response = await apiClient.get<ApiSuccess<{ tasks: Task[] }>>(
    API_ENDPOINTS.projects.tasks(projectId),
    { params: filters },
  );

  return response.data.data.tasks;
}

export async function getTask(projectId: string, taskId: string): Promise<Task> {
  const response = await apiClient.get<ApiSuccess<{ task: Task }>>(
    API_ENDPOINTS.projects.task(projectId, taskId),
  );

  return response.data.data.task;
}

export async function createTask(
  projectId: string,
  input: CreateTaskInput,
): Promise<Task> {
  const response = await apiClient.post<ApiSuccess<{ task: Task }>>(
    API_ENDPOINTS.projects.tasks(projectId),
    input,
  );

  return response.data.data.task;
}

export async function updateTask(
  projectId: string,
  taskId: string,
  input: UpdateTaskInput,
): Promise<Task> {
  const response = await apiClient.patch<ApiSuccess<{ task: Task }>>(
    API_ENDPOINTS.projects.task(projectId, taskId),
    input,
  );

  return response.data.data.task;
}

export async function deleteTask(projectId: string, taskId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.projects.task(projectId, taskId));
}
