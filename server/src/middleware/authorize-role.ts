    import { AppError } from "../errors/app-error.js";
    import { ErrorCode } from "../errors/error-codes.js";
    import type { UserRole } from "../generated/prisma/client.js";
    import type { Request,Response,NextFunction } from "express";



    export function  authorizeRole(...allowedRoles :readonly UserRole[]) {
        return (req:Request, res: Response, next:NextFunction): void => {

            if(!allowedRoles.includes(req.user.role)){
                next(
                    new AppError(
                        403,
                        ErrorCode.FORBIDDEN,
                        "You are not authorized to perform this action"
                    )
                )
                return
            }
            next();
            
        }

    }