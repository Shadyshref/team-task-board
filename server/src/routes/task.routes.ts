
import { Router } from "express";

import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  listTasksController,
  updateTaskController,
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireProjectAccess } from "../middleware/require-project-access.js";
import { validateRequest } from "../middleware/validate-request.js";
import {
  createTaskRequestSchema,
  projectTasksRequestSchema,
  taskRequestSchema,
  updateTaskRequestSchema,
} from "../validation/task.validation.js";

const taskRoutes = Router();

taskRoutes.get(
  "/projects/:projectId/tasks",
  authenticate,
  validateRequest(projectTasksRequestSchema),
  requireProjectAccess,
  listTasksController,
);

taskRoutes.post(
  "/projects/:projectId/tasks",
  authenticate,
  validateRequest(createTaskRequestSchema),
  requireProjectAccess,
  createTaskController,
);

taskRoutes.get(
  "/projects/:projectId/tasks/:taskId",
  authenticate,
  validateRequest(taskRequestSchema),
  requireProjectAccess,
  getTaskController,
);

taskRoutes.patch(
  "/projects/:projectId/tasks/:taskId",
  authenticate,
  validateRequest(updateTaskRequestSchema),
  requireProjectAccess,
  updateTaskController,
);

taskRoutes.delete(
  "/projects/:projectId/tasks/:taskId",
  authenticate,
  validateRequest(taskRequestSchema),
  requireProjectAccess,
  deleteTaskController,
);

export { taskRoutes };