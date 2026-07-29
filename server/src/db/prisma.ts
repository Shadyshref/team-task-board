
import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "../config/env.js";
import { PrismaClient } from "../generated/prisma/client.js";

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "test"
        ? []
        : [
            {
              emit: "stdout",
              level: "warn",
            },
            {
              emit: "stdout",
              level: "error",
            },
          ],
  });
}

const globalPrisma = globalThis as typeof globalThis & {
  teamTaskBoardPrisma?: PrismaClient;
};

export const prisma =
  globalPrisma.teamTaskBoardPrisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalPrisma.teamTaskBoardPrisma = prisma;
}