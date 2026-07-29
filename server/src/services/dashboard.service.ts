
import type { Request } from "express";
import { Prisma } from "../generated/prisma/client.js";
import {
  TaskPriority,
  TaskStatus,
  UserRole,
} from "../generated/prisma/enums.js";

import { prisma } from "../db/prisma.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";

type CurrentUser = Request["user"];

function getToday(): Date {
  const now = new Date();

  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  );
}

function getWeekRange() {
  const today = getToday();
  const currentDay = today.getUTCDay();

  const daysFromMonday =
    currentDay === 0 ? 6 : currentDay - 1;

  const start = new Date(today);

  start.setUTCDate(
    start.getUTCDate() - daysFromMonday,
  );

  const end = new Date(start);

  end.setUTCDate(end.getUTCDate() + 7);

  return {
    start,
    end,
  };
}

async function getAccessibleProjectIds(
  user: CurrentUser,
): Promise<string[]> {
  const where: Prisma.ProjectWhereInput =
    user.role === UserRole.ADMIN
      ? {}
      : {
          OR: [
            {
              ownerId: user.id,
            },
            {
              member: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        };

  const projects = await prisma.project.findMany({
    where,
    select: {
      id: true,
    },
  });

  return projects.map((project) => project.id);
}

export async function getDashboardSummary(
  user: CurrentUser,
) {
  const projectIds =
    await getAccessibleProjectIds(user);

  const today = getToday();
  const week = getWeekRange();

  const taskScope: Prisma.TaskWhereInput = {
    projectId: {
      in: projectIds,
    },
  };

  const [
    ownedProjectCount,
    openTaskCount,

    inProgressTaskCount,
    dueThisWeekCount,

    highPriorityDueThisWeekCount,
    overdueTaskCount,
    assignedToCurrentUserCount,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        ownerId: user.id,
      },
    }),

    prisma.task.count({
      where: {
        ...taskScope,
        status: {
          not: TaskStatus.DONE,
        },
      },
    }),

    prisma.task.count({
      where: {
        ...taskScope,
        status: TaskStatus.IN_PROGRESS,
      },
    }),

    prisma.task.count({
      where: {
        ...taskScope,
        status: {
          not: TaskStatus.DONE,
        },
        dueDate: {
          gte: week.start,
          lt: week.end,
        },
      },
    }),

    prisma.task.count({
      where: {
        ...taskScope,
        status: {
          not: TaskStatus.DONE,
        },
        priority: TaskPriority.HIGH,
        dueDate: {
          gte: week.start,
          lt: week.end,
        },
      },
    }),

    prisma.task.count({
      where: {
        ...taskScope,
        status: {
          not: TaskStatus.DONE,
        },
        dueDate: {
          lt: today,
        },
      },
    }),

    prisma.task.count({
      where: {
        ...taskScope,
        assigneeId: user.id,
        status: {
          not: TaskStatus.DONE,
        },
      },
    }),
  ]);

  return {
    accessibleProjectCount: projectIds.length,
    ownedProjectCount,
    openTaskCount,
    inProgressTaskCount,
    dueThisWeekCount,
    highPriorityDueThisWeekCount,
    overdueTaskCount,
    assignedToCurrentUserCount,
    weekStartsAt: week.start,   
    weekEndsAt: week.end,
  };
}

export async function getProjectSummary(
  projectId: string,
  userId: string,
) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    throw new AppError(
      404,
      ErrorCode.PROJECT_NOT_FOUND,
      "Project was not found",
    );
  }

  const today = getToday();

  const [
    memberCount,
    taskCount,
    openTaskCount,
    overdueTaskCount,
    assignedToCurrentUserCount,
    statusGroups,
    priorityGroups,
  ] = await Promise.all([
    prisma.projectMember.count({
      where: {
        projectId,
      },
    }),

    prisma.task.count({
      where: {
        projectId,
      },
    }),

    prisma.task.count({
      where: {
        projectId,
        status: {
          not: TaskStatus.DONE,
        },
      },
    }),

    prisma.task.count({
      where: {
        projectId,
        status: {
          not: TaskStatus.DONE,
        },
        dueDate: {
          lt: today,
        },
      },
    }),

    prisma.task.count({
      where: {
        projectId,
        assigneeId: userId,
        status: {
          not: TaskStatus.DONE,
        },
      },
    }),

    prisma.task.groupBy({
      by: ["status"],
      where: {
        projectId,
      },
      _count: {
        _all: true,
      },
    }),

    prisma.task.groupBy({
      by: ["priority"],
      where: {
        projectId,
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const taskCountByStatus = statusGroups.map(
    (group) => ({
      status: group.status,
      count: group._count._all,
    }),
  );

  const taskCountByPriority = priorityGroups.map(
    (group) => ({
      priority: group.priority,
      count: group._count._all,
    }),
  );

  return {
    memberCount,
    taskCount,
    openTaskCount,
    overdueTaskCount,
    assignedToCurrentUserCount,
    taskCountByStatus,
    taskCountByPriority,
  };
}