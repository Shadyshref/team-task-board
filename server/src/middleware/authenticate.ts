import type { NextFunction ,Request,Response} from "express";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";
import { verifyAccessToken } from "../utils/jwt.js";



export function authenticate(req:Request, res:Response, next:NextFunction) {
    const token :unknown = (req.cookies as Record<string,unknown> )[env.COOKIE_NAME]


    if(typeof token !== "string" || token.length === 0){
        next(
            new AppError(
                401,
                ErrorCode.AUTHENTICATION_REQUIRED,
                "Authentication is required",
            )
        )
        
        return
    }
        try {
            const payload = verifyAccessToken(token)
            req.user={
                id:payload.userId,
                role:payload.role
            }
            next()
        } catch (error) {
            next(error)
            
        }
    
}