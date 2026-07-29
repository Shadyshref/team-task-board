import type { Request } from "express";
import { Prisma, TaskStatus, UserRole } from "../generated/prisma/client.js";
import { prisma } from "../db/prisma.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";
import type { CreateProjectInput, UpdateProjectInput } from "../validation/project.validation.js";


type currentUser = Request["user"]


const projectSelect = {
  id: true,
  name: true,
  description: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,

  owner: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },

  _count: {
    select: {
      member: true,

      task: {
        where: {
          status: {
            not: TaskStatus.DONE,
          },
        },
      },
    },
  },
} satisfies Prisma.ProjectSelect;



function isPrismaError(error:unknown,code:string):boolean{

    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === code
    )


}


function getAccessibleProjectFilter(user:currentUser) :Prisma.ProjectWhereInput{
    if(user.role === UserRole.ADMIN){
        return {}
    }

    return {
        OR:[
            {
                ownerId:user.id

        },
       {
         member:{
            some:{
                userId:user.id
            }
        }
       }

        ]
    }
    
}

export async function assertProjectAccess(projectId:string,user:currentUser):Promise<void>{
const  project = await prisma.project.findUnique({
    where:{
        id:projectId
    },
    select: {
      ownerId: true, 
    }
    
})

if(project===null){
    throw new AppError(404,ErrorCode.PROJECT_NOT_FOUND,"Project was not found")
}
const isAdmin= user.role === UserRole.ADMIN
const isOwner = project.ownerId === user.id

if(isAdmin || isOwner){
    return
}
   
const memberShip = await prisma.projectMember.findUnique({
    where:{
        projectId_userId:{
            projectId:projectId,
            userId:user.id
        }
    },
    select:{
        userId:true
    }
})
if (!memberShip) {
    throw new AppError(
      403,
      ErrorCode.FORBIDDEN,
      "You do not have access to this project",
    );
  }

}
export async function assertProjectManager(
  projectId: string,
  user: currentUser,
): Promise<void> {
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

  const isAdmin = user.role === UserRole.ADMIN;
  const isOwner = project.ownerId === user.id;

  if (!isAdmin && !isOwner) {


    throw new AppError(
      403,
      ErrorCode.FORBIDDEN,
      "Only the project owner or administrator can perform this action",
    );
  }
}


export async function createProject(input:CreateProjectInput,user:currentUser){
    return prisma.$transaction(async (tx)=> {
        const createProject = await tx.project.create({
            data:{
                name:input.name,
                description:input.description ?? null,
                ownerId:user.id
            },
            select:{
                id:true
            }
        })
        await tx.projectMember.create({
            data:{
                projectId:createProject.id,
                userId:user.id
            }
        })
        return tx.project.findFirstOrThrow({
            where:{
                id:createProject.id
            },
            select:projectSelect
        })
    })

}
export async function listAccessibleProjects(
  user: currentUser,
) {
  return prisma.project.findMany({


    where: getAccessibleProjectFilter(user),

    select: projectSelect,
    orderBy: {
      updatedAt: "desc",
    },
  });
}


export async function getProjectById(
  projectId: string,
) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: projectSelect,
  });

  if (!project) {
    throw new AppError(
      404,
      ErrorCode.PROJECT_NOT_FOUND,
      "Project was not found",
    );
  }

  return project;
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
) {
  const data: Prisma.ProjectUpdateInput = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }

  if (input.description !== undefined) {
    data.description = input.description;
  }

  try {
    return await prisma.project.update({
      where: {
        id: projectId,
      },
      data,
      select: projectSelect,
    });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      throw new AppError(
        404,
        ErrorCode.PROJECT_NOT_FOUND,
        "Project was not found",
      );
    }

    throw error;
  }
}


export async function deleteProject(
  projectId: string,
  
): Promise<void> {
  try {
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      throw new AppError(
        404,
        ErrorCode.PROJECT_NOT_FOUND,
        "Project was not found",
      );
    }

    throw error;
  }
}