import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import { generalRateLimiter } from "./middleware/rate-limiters.js";
import { trustedOrigin } from "./middleware/trusted-origin.js";
import { authRoutes } from "./routes/auth.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { projectMemberRoutes } from "./routes/project-member.routes.js";
import { projectRoutes } from "./routes/project.routes.js";
import { taskRoutes } from "./routes/task.routes.js";

const app = express();

if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  pinoHttp({
    logger,
  }),
);

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(trustedOrigin);

app.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    data: {
      status: "ok",
    },
  });
});

app.use("/api/v1", generalRateLimiter);

app.use("/api/v1", authRoutes);
app.use("/api/v1", projectRoutes);
app.use("/api/v1", projectMemberRoutes);
app.use("/api/v1", taskRoutes);
app.use("/api/v1", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export { app };
export default app;