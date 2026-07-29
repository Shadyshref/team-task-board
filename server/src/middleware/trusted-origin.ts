
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

export function trustedOrigin(
  req: Request,
res: Response,
  next: NextFunction,
) {
  if (
    env.NODE_ENV === "test" ||
    safeMethods.has(req.method)
  ) {
    next();
    return;
  }

  const origin = req.get("origin");

  if (origin === undefined) {


    next();
    return;
  }

  if (origin !== env.CLIENT_URL) {


    next(
      new AppError(
        403,
        ErrorCode.TRUSTED_ORIGIN_REQUIRED,
        "Request origin is not allowed",
      ),


    );

    return;
  }

  next();
}