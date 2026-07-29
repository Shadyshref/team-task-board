
import type {
  ErrorRequestHandler,
  Request,
  Response,
} from "express";
import { Prisma } from "../generated/prisma/client.js";
import { ZodError } from "zod";

import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";

function sendError(
  response: Response,
  statusCode: number,
  code: ErrorCode,
  message: string,
  details?: unknown,
): void {
  response.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  });
}

function isBodyParseError(error: unknown): error is SyntaxError {
  return error instanceof SyntaxError && "body" in error;
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  request: Request,
  response: Response,
  next,
): void => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {


    sendError(
      response,
      error.statusCode,

      error.code,
      error.message,
      error.details,
    );

    return;
  }

  if (error instanceof ZodError) {
    sendError(
      response,
      400,
      ErrorCode.VALIDATION_ERROR,
      "Request validation failed",
      error.issues.map((issue) => ({
        field: issue.path.join("."),

        message: issue.message,
      })),
    );

    return;
  }

  if (isBodyParseError(error)) {
    sendError(



      response,
      400,
      ErrorCode.VALIDATION_ERROR,

      "Request body contains invalid JSON",
    );

    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      sendError(
        response,
        409,
        ErrorCode.DATABASE_CONFLICT,
        "A record with this value already exists",
      );

      return;
    }

    if (error.code === "P2025") {
      sendError(
        response,
        404,
        ErrorCode.NOT_FOUND,
        "The requested record was not found",
      );

      return;
    }
  }

  logger.error(

    {
      error,
      method: request.method,
      path: request.originalUrl,
      userId: request.user?.id,
    },
    "Unhandled API error",
  );

  sendError(

    
    response,
    500,
    ErrorCode.INTERNAL_ERROR,
    env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : "An unexpected error occurred. Check server logs.",
  );
};