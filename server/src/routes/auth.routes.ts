
import { Router } from "express";

import {
  currentUserController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authRateLimiter } from "../middleware/rate-limiters.js";
import { validateRequest } from "../middleware/validate-request.js";
import {
  loginRequestSchema,
  registerRequestSchema,
} from "../validation/auth.validation.js";

const authRoutes = Router();

authRoutes.post(
  "/auth/register",
  authRateLimiter,
  validateRequest(registerRequestSchema),
  registerController,
);

authRoutes.post(
  "/auth/login",
  authRateLimiter,
  validateRequest(loginRequestSchema),
  loginController,
);

authRoutes.post(
  "/auth/logout",
  logoutController,
);

authRoutes.get(
  "/auth/me",
  authenticate,
  currentUserController,
);

export { authRoutes };