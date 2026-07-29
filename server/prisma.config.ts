import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "schema/schema.prisma",
  migrations: {
    path: "schema/migrations",
    seed: "tsx schema/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
