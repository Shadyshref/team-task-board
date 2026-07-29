
import { Router } from "express";

import {
  addProjectMemberController,
  listProjectMembersController,
  removeProjectMemberController,
} from "../controllers/project-member.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireProjectAccess } from "../middleware/require-project-access.js";
import { requireProjectManager } from "../middleware/require-project-manager.js";
import { validateRequest } from "../middleware/validate-request.js";
import {
  addProjectMemberRequestSchema,
  projectMemberRequestSchema,
} from "../validation/project-member.validation.js";
import { projectIdRequestSchema } from "../validation/project.validation.js";

const projectMemberRoutes = Router();

projectMemberRoutes.get(
  "/projects/:projectId/members",
  authenticate,
  validateRequest(projectIdRequestSchema),
  requireProjectAccess,
  listProjectMembersController,
);

projectMemberRoutes.post(
  "/projects/:projectId/members",
  authenticate,
  validateRequest(addProjectMemberRequestSchema),
  requireProjectManager,
  addProjectMemberController,
);

projectMemberRoutes.delete(
  "/projects/:projectId/members/:userId",
  authenticate,
  validateRequest(projectMemberRequestSchema),
  requireProjectManager,
  removeProjectMemberController,
);

export { projectMemberRoutes };