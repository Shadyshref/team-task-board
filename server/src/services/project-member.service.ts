

import { prisma } from "../db/prisma.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";
import  { Prisma } from "../generated/prisma/client.js";
import type { AddProjectMemberInput } from "../validation/project-member.validation.js";



const memberSelect = {
  projectId: true,
  userId: true,
  createdAt: true,

  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.ProjectMemberSelect;

type MemberItem = Prisma.ProjectMemberGetPayload<{
  select: typeof memberSelect;
}>;

type MemberResponse = MemberItem & {
  isOwner: boolean;
};

function isPrismaError(
  error: unknown,
  code: string,
): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === code
  );
}

export async function listProjectMembers(
  projectId: string,
): Promise<MemberResponse[]> {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      ownerId: true,
    },
  });

  if (!project) {
    throw new AppError(
      404,
      ErrorCode.PROJECT_NOT_FOUND,
      "Project was not found",
    );
  }

  const members: MemberItem[] =
    await prisma.projectMember.findMany({
      where: {
        projectId,
      },
      select: memberSelect,
      orderBy: {
        createdAt: "asc",
      },
    });

  return members.map(
    (member): MemberResponse => ({
      projectId: member.projectId,
      userId: member.userId,
      createdAt: member.createdAt,
      user: member.user,
      isOwner: member.userId === project.ownerId,
    }),
  );
}
export async function addProjectMember(
  projectId: string,
  input: AddProjectMemberInput,
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

  const user = await prisma.user.findUnique({
    where: {
      email: input.email.toLowerCase(),
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError(
      404,
      ErrorCode.USER_NOT_FOUND,
      "No registered user was found with this email",
    );
  }

  try {
    return await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
      },
      select: memberSelect,
    });
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
    throw new AppError(
      409,
      ErrorCode.MEMBERSHIP_ALREADY_EXISTS,
      "This user is already a project member",
    );
  }

  if (isPrismaError(error, "P2003")) {
    throw new AppError(
      404,
      ErrorCode.PROJECT_NOT_FOUND,
      "Project or user was not found",
    );
  }


    throw error;
  }
}

export async function removeProjectMember(
  projectId: string,
  userId: string,
): Promise<void> {
  await prisma.$transaction(async (transaction) => {
    const project =
      await transaction.project.findUnique({
        where: {
          id: projectId,
        },
        select: {
          ownerId: true,
        },
      });

    if (!project) {
      throw new AppError(
        404,
        ErrorCode.PROJECT_NOT_FOUND,
        "Project was not found",
      );
    }

    if (project.ownerId === userId) {
      throw new AppError(
        400,
        ErrorCode.OWNER_REMOVAL_FORBIDDEN,
        "The project owner cannot be removed",
      );
    }

    const membership =
      await transaction.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
      });

    if (!membership) {
      throw new AppError(
        404,
        ErrorCode.MEMBERSHIP_NOT_FOUND,
        "Project membership was not found",
      );
    }

    await transaction.task.updateMany({
      where: {
        projectId,
        assigneeId: userId,
      },
      data: {
        assigneeId: null,
      },
    });

    await transaction.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  });
}