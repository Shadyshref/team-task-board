import jwt, {
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";

import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCode } from "../errors/error-codes.js";
import { UserRole } from "../generated/prisma/enums.js";

export type AccessTokenPayload = {
  userId: string;
  role: UserRole;
};

function isUserRole(value: unknown): value is UserRole {
  return value === UserRole.ADMIN || value === UserRole.MEMBER;
}

export function createAccessToken(
  payload: AccessTokenPayload,
): string {
  const options: SignOptions = {
    subject: payload.userId,
    expiresIn:
      env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>,
  };

  return jwt.sign(
    {
      role: payload.role,
    },
    env.JWT_SECRET,
    options,
  );
}

export function verifyAccessToken(
  token: string,
): AccessTokenPayload {
  let decodedToken: string | JwtPayload;

  try {
    decodedToken = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new AppError(
      401,
      ErrorCode.AUTHENTICATION_REQUIRED,
      "Authentication is required",
    );
  }

  if (
    typeof decodedToken === "string" ||
    typeof decodedToken.sub !== "string" ||
    !isUserRole(decodedToken.role)
  ) {
    throw new AppError(
      401,
      ErrorCode.AUTHENTICATION_REQUIRED,
      "Authentication token is invalid",
    );
  }

  return {
    userId: decodedToken.sub,
    role: decodedToken.role,
  };
}