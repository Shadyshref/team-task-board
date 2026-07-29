import type {
  Request,
  Response,
} from "express";
import rateLimit from "express-rate-limit";

import { env } from "../config/env.js";
import { ErrorCode } from "../errors/error-codes.js";

function sendRateLimitError(
  _request: Request,
  response: Response,
): void {
  response.status(429).json({
    success: false,

    error: {
      code: ErrorCode.RATE_LIMITED,
      message: "Too many requests, please try again later",
    },
  });
}

export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: sendRateLimitError,
});

export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: sendRateLimitError,
});