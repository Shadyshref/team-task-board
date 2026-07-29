
import type {
  Request,
  Response,
} from "express";

import {
  createProject,
  deleteProject,
  getProjectById,
  listAccessibleProjects,
  updateProject,
} from "../services/project.service.js";
import {
  
  sendSuccess,
} from "../utils/api-response.js";
import type {
  CreateProjectInput,
  ProjectIdParams,
  UpdateProjectInput,
} from "../validation/project.validation.js";

export async function createProjectController(
  request: Request,
  response: Response,
): Promise<void> {
  const input =
    request.validated.body as CreateProjectInput;

  const project = await createProject(
    input,
    request.user,
  );

  sendSuccess(
    response,
    201,
    { project },
    "Project created successfully",
  );
}

export async function listProjectsController(
  request: Request,
  response: Response,
): Promise<void> {
  const projects = await listAccessibleProjects(
    request.user,
  );

  sendSuccess(response, 200, {
    projects,
  });
}

export async function getProjectController(
  request: Request,
  response: Response,
): Promise<void> {
  const { projectId } =
    request.validated.params as ProjectIdParams;

  const project = await getProjectById(projectId);

  sendSuccess(response, 200, {
    project,
  });
}

export async function updateProjectController(
  request: Request,
  response: Response,
): Promise<void> {
  const { projectId } =
    request.validated.params as ProjectIdParams;

  const input =
    request.validated.body as UpdateProjectInput;

  const project = await updateProject(
    projectId,
    input,
  );

  sendSuccess(
    response,
    200,
    { project },
    "Project updated successfully",
  );
}

export async function deleteProjectController(
  request: Request,
  response: Response,
): Promise<void> {
  const { projectId } =
    request.validated.params as ProjectIdParams;

  await deleteProject(projectId);

  sendSuccess(response, 200, {
    message: "Project deleted successfully",
  });
}