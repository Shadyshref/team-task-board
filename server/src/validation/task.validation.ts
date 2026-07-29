import { z } from "zod";

import {
  TaskPriority,
  TaskStatus,
} from "../generated/prisma/enums.js";

import { projectIdParamsSchema } from "./project.validation.js";

const taskTitleSchema = z
  .string()
  .trim()
  .min(2, "Task title must contain at least 2 characters")
  .max(160, "Task title must be at most 160 characters");

const taskDescriptionSchema = z
  .union([
    z
      .string()
      .trim()
      .max(5_000, "Description must be at most 5000 characters"),
    z.null(),
  ])
  .optional()
  .transform((value) => (value === "" ? null : value));

const taskDueDateSchema = z
  .union([
    z.iso.date("Due date must use YYYY-MM-DD format"),
    z.null(),
  ])
  .optional();

const assigneeIdSchema = z
  .union([
    z.string().uuid("Assignee ID must be a valid UUID"),
    z.null(),
  ])
  .optional();

export const taskIdParamsSchema = projectIdParamsSchema.extend({
  taskId: z.string().uuid("Task ID must be a valid UUID"),
});

export const createTaskBodySchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(TaskPriority).optional(),
  assigneeId: assigneeIdSchema,
  dueDate: taskDueDateSchema,
});

export const updateTaskBodySchema = z
  .object({
    title: taskTitleSchema.optional(),
    description: taskDescriptionSchema,
    status: z.enum(TaskStatus).optional(),
    priority: z.enum(TaskPriority).optional(),
    assigneeId: assigneeIdSchema,
    dueDate: taskDueDateSchema,
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.description !== undefined ||
      value.status !== undefined ||
      value.priority !== undefined ||
      value.assigneeId !== undefined ||
      value.dueDate !== undefined,
    {
      message: "Provide at least one task field to update",
    },
  );

export const taskFilterQuerySchema = z.object({
  status: z.enum(TaskStatus).optional(),

  priority: z.enum(TaskPriority).optional(),

  assigneeId: z
    .union([
      z.string().uuid("Assignee ID must be a valid UUID"),
      z.literal("unassigned"),
    ])
    .optional(),
});

export const projectTasksRequestSchema = z.object({
  params: projectIdParamsSchema,
  query: taskFilterQuerySchema,

});

export const createTaskRequestSchema = z.object({
  params: projectIdParamsSchema,

  body: createTaskBodySchema,
});

export const taskRequestSchema = z.object({
  params: taskIdParamsSchema,
});

export const updateTaskRequestSchema = z.object({
  params: taskIdParamsSchema,

  body: updateTaskBodySchema,
});

export type CreateTaskInput = z.infer<
  typeof createTaskBodySchema

  
>;

export type UpdateTaskInput = z.infer<
  typeof updateTaskBodySchema
>;

export type TaskFilterInput = z.infer<
  typeof taskFilterQuerySchema
>;

export type TaskIdParams = z.infer<typeof taskIdParamsSchema>;