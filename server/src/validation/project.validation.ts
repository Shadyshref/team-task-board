import { z } from "zod";

const projectNameSchema = z
  .string()
  .trim()
  .min(2, "Project name must contain at least 2 characters")
  .max(120, "Project name must be at most 120 characters");

const descriptionSchema = z
  .union([
    z
      .string()
      .trim()
      .max(2_000, "Description must be at most 2000 characters"),
    z.null(),
  ])
  .optional()
  .transform((value) => (value === "" ? null : value));

export const projectIdParamsSchema = z.object({
  projectId: z.string().uuid("Project ID must be a valid UUID"),
});

export const createProjectBodySchema = z.object({
  name: projectNameSchema,
  description: descriptionSchema,
});

export const updateProjectBodySchema = z
  .object({
    name: projectNameSchema.optional(),
    description: descriptionSchema,
  })
  .refine(
    (value) =>
      value.name !== undefined || value.description !== undefined,
    {
      message: "Provide at least one project field to update",
    },
  );

export const projectIdRequestSchema = z.object({
  params: projectIdParamsSchema,
});

export const createProjectRequestSchema = z.object({
  body: createProjectBodySchema,
});

export const updateProjectRequestSchema = z.object({
  params: projectIdParamsSchema,
  body: updateProjectBodySchema,
});

export type ProjectIdParams = z.infer<typeof projectIdParamsSchema>;

export type CreateProjectInput = z.infer<
  typeof createProjectBodySchema
>;

export type UpdateProjectInput = z.infer<
  typeof updateProjectBodySchema
>;