
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { assertProjectAccess } from "../services/project.service.js";
import type { ProjectIdParams } from "../validation/project.validation.js";

export async function requireProjectAccess(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { projectId } =
      request.validated.params as ProjectIdParams;

    await assertProjectAccess(
      projectId,
      request.user,
    );

    next();
  } catch (error) {
    next(error);
  }
}