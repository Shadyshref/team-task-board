
import { Router } from "express";

import {
  dashboardSummaryController,
  projectSummaryController,
} from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireProjectAccess } from "../middleware/require-project-access.js";
import { validateRequest } from "../middleware/validate-request.js";
import { projectIdRequestSchema } from "../validation/project.validation.js";

const dashboardRoutes = Router();

dashboardRoutes.get(
  "/dashboard/summary",
  authenticate,
  dashboardSummaryController,
);

dashboardRoutes.get(
  "/projects/:projectId/summary",
  authenticate,
  validateRequest(projectIdRequestSchema),
  requireProjectAccess,
  projectSummaryController,
);

export { dashboardRoutes };