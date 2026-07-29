
import type {
  Request,
  Response,
} from "express";

import {
  addProjectMember,
  listProjectMembers,
  removeProjectMember,
} from "../services/project-member.service.js";
import {
  sendNoContent,
  sendSuccess,
} from "../utils/api-response.js";
import type {
  AddProjectMemberInput,
  ProjectMemberParams,
} from "../validation/project-member.validation.js";
import type { ProjectIdParams } from "../validation/project.validation.js";

export async function listProjectMembersController(
  request: Request,
  response: Response,
): Promise<void> {
  const { projectId } =
    request.validated.params as ProjectIdParams;

  const members = await listProjectMembers(projectId);

  sendSuccess(response, 200, {
    members,
  });
}

export async function addProjectMemberController(


  request: Request,
  response: Response,
): Promise<void> {
  const { projectId } =

  
    request.validated.params as ProjectIdParams;

  const input =
    request.validated.body as AddProjectMemberInput;
    
  const member = await addProjectMember(
    projectId,
    input,
  );

  sendSuccess(
    response,
    201,
    {
      member,
    },
    "Project member added successfully",
  );
}

export async function removeProjectMemberController(
  request: Request,
  response: Response,
): Promise<void> {
  const { projectId, userId } =
    request.validated.params as ProjectMemberParams;

  await removeProjectMember(projectId, userId);

  sendNoContent(response);
}