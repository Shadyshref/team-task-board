
import type { Request } from "express";
import { Prisma } from "../generated/prisma/client.js";
import {
  TaskPriority,
  TaskStatus,
} from "../generated/prisma/enums.js";

import { prisma } from "../db/prisma.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";
import type {
  CreateTaskInput,
  TaskFilterInput,
  UpdateTaskInput,
} from "../validation/task.validation.js";

type CurrentUser = Request["user"];

const taskSelect = {
  id: true,
  title: true, 

  description: true,
  status: true,
  priority: true,
  dueDate: true,
  projectId: true,
  creatorId: true,
  assigneeId: true,

  createdAt: true,
  updatedAt: true,

  creator: {
    
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },

  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.TaskSelect;

function isPrismaError(
  error: unknown,
  code: string,
): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === code
  );
}

function convertDate(
  value: string | null ,
): Date | null  {
//   if (value === undefined) {
//     return undefined;
//   }

  if (value === null) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
}

async function checkAssignee(
  transaction: Prisma.TransactionClient,
  projectId: string,
  assigneeId: string | null | undefined,
): Promise<void> {
  if (!assigneeId) {
    return;
  }

  const membership =
    await transaction.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: assigneeId,
        },
      },
    });

  if (!membership) {
    throw new AppError(
      400,
      ErrorCode.INVALID_ASSIGNEE,
      "The assignee must be a member of this project",
    );
  }
}

export async function createTask(
  projectId: string,
  input: CreateTaskInput,
  user: CurrentUser,
) {
  try {
    return await prisma.$transaction(
      async (tx) => {
        await checkAssignee(
          tx,
          projectId,
          input.assigneeId,
        );

        return tx.task.create({
          data: {
            projectId,
            creatorId: user.id,
            title: input.title,
            description: input.description ?? null,
            status: input.status ?? TaskStatus.TODO,
            priority:
              input.priority ?? TaskPriority.MEDIUM,
            assigneeId: input.assigneeId ?? null,
            dueDate:
              convertDate(input.dueDate ?? null),
          },
          select: taskSelect,
        });
      },
    );
  } catch (error) {
    if (isPrismaError(error, "P2003")) {
      throw new AppError(
        404,
        ErrorCode.PROJECT_NOT_FOUND,
        "Project was not found",
      );
    }

    throw error;
  }
}

export async function listProjectTasks(
  projectId: string,
  filters: TaskFilterInput,
) {
  const where: Prisma.TaskWhereInput = {
    projectId,
  };

  if (filters.status !== undefined) {
    where.status = filters.status;
  }

  if (filters.priority !== undefined) {
    where.priority = filters.priority;
  }

  if (filters.assigneeId === "unassigned") {
    where.assigneeId = null;
  } else if (filters.assigneeId !== undefined) {
    where.assigneeId = filters.assigneeId;
  }

  return prisma.task.findMany({
    where,
    select: taskSelect,
    orderBy: [
      {
        dueDate: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getTaskById(
  projectId: string,
  taskId: string,
) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
    },
    select: taskSelect,
  });

  if (!task) {
    throw new AppError(
      404,
      ErrorCode.TASK_NOT_FOUND,
      "Task was not found",
    );
  }

  return task;
}

export async function updateTask(
  projectId: string,
  taskId: string,
  input: UpdateTaskInput,
) {
  return prisma.$transaction(async (transaction) => {
    const task = await transaction.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
      select: {
        id: true,
      },
    });

    if (!task) {
      throw new AppError(
        404,
        ErrorCode.TASK_NOT_FOUND,
        "Task was not found",
      );
    }

    if (input.assigneeId !== undefined) {
      await checkAssignee(
        transaction,
        projectId,
        input.assigneeId,
      );
    }

    const data: Prisma.TaskUncheckedUpdateInput = {};

    if (input.title !== undefined) {
      data.title = input.title;
    }

    if (input.description !== undefined) {
      data.description = input.description;
    }

    if (input.status !== undefined) {
      data.status = input.status;
    }

    if (input.priority !== undefined) {
      data.priority = input.priority;
    }

    if (input.assigneeId !== undefined) {
      data.assigneeId = input.assigneeId;
    }

    if (input.dueDate !== undefined) {
      data.dueDate = convertDate(input.dueDate);
    }

    return transaction.task.update({
      where: {
        id: task.id,
      },
      data,
      select: taskSelect,
    });
  });
}

export async function deleteTask(
  projectId: string,
  taskId: string,
): Promise<void> {
  const result = await prisma.task.deleteMany({
    where: {
      id: taskId,
      projectId,
    },
  });

  if (result.count === 0) {
    throw new AppError(
      404,
      ErrorCode.TASK_NOT_FOUND,
      "Task was not found",
    );
  }
}