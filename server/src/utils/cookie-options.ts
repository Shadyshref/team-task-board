
import type { CookieOptions } from "express";

import { env } from "../config/env.js";

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: env.COOKIE_MAX_AGE_MS,
    path: "/",
  };
}

export function getClearCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}