import { prisma } from "../db/prisma.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";
import  { Prisma } from "../generated/prisma/client.js";
import { createAccessToken } from "../utils/jwt.js";
import { hashedPassword, verifyPassword } from "../utils/password.js";
import type { LoginInput, RegisterInput } from "../validation/auth.validation.js";



const publicUserSelect ={
    id:true,
    name:true,
    email:true,
    role:true,
    createdAt:true,

    updatedAt:true
} satisfies Prisma.UserSelect;


function isDuplicateEmailError( error: unknown):boolean{
    return(
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    )
}

export async function registerUser(input:RegisterInput){
    const passwordHash = await hashedPassword(input.password);

    try {
        const user = await prisma.user.create({
            data:{
                name:input.name,
                email:input.email.toLocaleLowerCase(),
                passwordHash,
                
            },
            select:publicUserSelect
        })
        const accessToken=  createAccessToken({
            userId:user.id,
            role:user.role
        })
        return {user,accessToken};
    } catch (error) {
        if(isDuplicateEmailError(error)){
            throw new AppError(409,ErrorCode.EMAIL_ALREADY_EXISTS,"An account with this email already exists")
                
            
        }
        throw error
        
    }

}


export async function loginUser(input:LoginInput){
    const user = await prisma.user.findUnique({
        where:{
            email:input.email.toLocaleLowerCase()
        },
        select:{
            ...publicUserSelect,
            passwordHash:true
        }
    })
    if(user == null){
        throw new AppError(401,ErrorCode.INVALID_CREDENTIALS,"Email or password is incorrect")
    }

    const isPasswordCorrect = await verifyPassword(
        input.password,
        user.passwordHash);


    if(!isPasswordCorrect){
        throw new AppError(401,ErrorCode.INVALID_CREDENTIALS,"Email or password is incorrect")
    }


    const safeUser ={
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt
    }
    const accessToken=  createAccessToken({
        userId:user.id,
        role:user.role
    })

    return {user:safeUser,accessToken};
}

export async function getCurrentUser(userId:string){
    const user = await prisma.user.findUnique({
        where:{
            id:userId
        },
        select:publicUserSelect
    })
    if(user == null){
        throw new AppError(404,ErrorCode.USER_NOT_FOUND,"Authentication is required")
    }
    return user
}