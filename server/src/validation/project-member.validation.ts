import { z } from "zod";

import { projectIdParamsSchema } from "./project.validation.js";

export const addProjectMemberBodySchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email must be valid")
    .max(255, "Email must be at most 255 characters"),
});

export const projectMemberParamsSchema =

  projectIdParamsSchema.extend({
    userId: z.string().uuid("User ID must be a valid UUID"),
  });

export const addProjectMemberRequestSchema = z.object({
  params: projectIdParamsSchema,
  body: addProjectMemberBodySchema,
});

export const projectMemberRequestSchema = z.object({
  params: projectMemberParamsSchema,
  
});

export type AddProjectMemberInput = z.infer<


  typeof addProjectMemberBodySchema
>;

export type ProjectMemberParams = z.infer<
  typeof projectMemberParamsSchema
>;