
import type {
 
  Request,
  Response,
  NextFunction
} from "express";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";

export function notFound(req:Request,res:Response,next:NextFunction) {
  next(
    new AppError(
      404,
      ErrorCode.NOT_FOUND,
      "Route not found",
    )
  )
}