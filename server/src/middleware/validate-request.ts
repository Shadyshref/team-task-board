import type {
  NextFunction,
  Request,
  Response,
} from "express";
import type z from "zod";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";



type RequestSchema = z.ZodType<{
    body?:unknown;
    params?:unknown;
    query?:unknown
}>


export function validateRequest(schema:RequestSchema) {

    return (req:Request,res:Response,next:NextFunction): void=> {
        const result = schema.safeParse({
            body: req.body as unknown,
            params: req.params,
            query: req.query
        });
        if(!result.success){
            const details= result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }))

            next(
                new AppError(
                    400,ErrorCode.VALIDATION_ERROR,"Request validation failed",details
                )
            )
            return
        }
        req.validated= result.data;
        next();



    }

}
    
