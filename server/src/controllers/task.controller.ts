
import type {
  Request,
  Response,
} from "express";

import {
  createTask,
  deleteTask,
  getTaskById,
  listProjectTasks,
  updateTask,
} from "../services/task.service.js";
import {
  sendNoContent,
  sendSuccess,
} from "../utils/api-response.js";
import type { ProjectIdParams } from "../validation/project.validation.js";
import type {
  CreateTaskInput,
  TaskFilterInput,
  TaskIdParams,
  UpdateTaskInput,
} from "../validation/task.validation.js";

export async function createTaskController(
  request: Request,
  response: Response,
): Promise<void> {
  const { projectId } =
    request.validated.params as ProjectIdParams;

  const input =
    request.validated.body as CreateTaskInput;

  const task = await createTask(
    projectId,
    input,
    request.user,
  );

  sendSuccess(
    response,
    201,
    { task },
    "Task created successfully",
  );
}

export async function listTasksController(
  request: Request,
  response: Response,
): Promise<void> {
  const { projectId } =
    request.validated.params as ProjectIdParams;

  const filters =
    request.validated.query as TaskFilterInput;

  const tasks = await listProjectTasks(

    projectId,
    filters,
  );

  sendSuccess(response, 200, {
    tasks,
  });
}

export async function getTaskController(
  request: Request,
  response: Response,
): Promise<void> {
  const { projectId, taskId } =
    request.validated.params as TaskIdParams;

  const task = await getTaskById(
    projectId,
    taskId,
  );

  sendSuccess(response, 200, {


    task,
  });
}

export async function updateTaskController(
  request: Request,
  response: Response,
): Promise<void> {
  const { projectId, taskId } =
    request.validated.params as TaskIdParams;

  const input =
    request.validated.body as UpdateTaskInput;

  const task = await updateTask(
    projectId,
    taskId,
    input,

  );

  sendSuccess(
    response,
    200,
    { task },
    "Task updated successfully",
  );
}

export async function deleteTaskController(
  request: Request,
  response: Response,
): Promise<void> {
    
  const { projectId, taskId } =
    request.validated.params as TaskIdParams;

  await deleteTask(projectId, taskId);

  sendNoContent(response);
}