
import { Router } from "express";

import {
  createProjectController,
  deleteProjectController,
  getProjectController,
  listProjectsController,
  updateProjectController,
} from "../controllers/project.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireProjectAccess } from "../middleware/require-project-access.js";
import { requireProjectManager } from "../middleware/require-project-manager.js";
import { validateRequest } from "../middleware/validate-request.js";
import {
  createProjectRequestSchema,
  projectIdRequestSchema,
  updateProjectRequestSchema,
} from "../validation/project.validation.js";

const projectRoutes = Router();

projectRoutes.get(
  "/projects",
  authenticate,
  listProjectsController,
);

projectRoutes.post(
  "/projects",
  authenticate,
  validateRequest(createProjectRequestSchema),
  createProjectController,
);

projectRoutes.get(
  "/projects/:projectId",
  authenticate,
  validateRequest(projectIdRequestSchema),
  requireProjectAccess,
  getProjectController,
);

projectRoutes.patch(
  "/projects/:projectId",
  authenticate,
  validateRequest(updateProjectRequestSchema),
  requireProjectManager,
  updateProjectController,
);

projectRoutes.delete(
  "/projects/:projectId",
  authenticate,
  validateRequest(projectIdRequestSchema),
  requireProjectManager,
  deleteProjectController,
);

export { projectRoutes };