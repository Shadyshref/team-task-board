import pino from "pino";

import { env } from "./env.js";

const developmentTransport = {
  target: "pino-pretty",
  options: {
    colorize: true,
    singleLine: true,
    translateTime: "SYS:standard",
  },
};

export const logger = pino({
  level: env.LOG_LEVEL,

  redact: {
    paths: [
      "password",
      "passwordHash",
      "req.body.password",
      "req.body.confirmPassword",
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers.set-cookie",
    ],

    censor: "[REDACTED]",
  },

  ...(env.NODE_ENV === "development"
    ? {
        transport: developmentTransport,
      }
    : {}),
});