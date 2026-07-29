
import type {
  Request,
  Response,
} from "express";

import {
  getDashboardSummary,
  getProjectSummary,
} from "../services/dashboard.service.js";
import { sendSuccess } from "../utils/api-response.js";
import type { ProjectIdParams } from "../validation/project.validation.js";

export async function dashboardSummaryController(
  request: Request,
  response: Response,
): Promise<void> {
  const summary = await getDashboardSummary(
    request.user,
  );

  sendSuccess(response, 200, {
    summary,
  });
}

export async function projectSummaryController(
  request: Request,
  response: Response,
): Promise<void> {
  const { projectId } =
    request.validated.params as ProjectIdParams;

  const summary = await getProjectSummary(
    projectId,
    request.user.id,
  );

  sendSuccess(response, 200, {
    summary,
  });
}