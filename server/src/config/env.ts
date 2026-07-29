
import "dotenv/config";

import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) =>
        value.startsWith("postgresql://") ||
        value.startsWith("postgres://"),
      "DATABASE_URL must be a PostgreSQL connection URL",
    ),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must contain at least 32 characters"),

  JWT_EXPIRES_IN: z.string().min(1).default("8h"),

  CLIENT_URL: z.string().url().default("http://localhost:3000"),

  COOKIE_NAME: z.string().min(1).default("access_token"),

  COOKIE_MAX_AGE_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(8 * 60 * 60 * 1000),

  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 9000),

  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  throw new Error(
    `Invalid environment configuration:\n${z.prettifyError(
      parsedEnvironment.error,
    )}`,
  );
}

export const env = parsedEnvironment.data;