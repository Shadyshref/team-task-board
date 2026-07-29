import "express";
import type { UserRole } from "../generated/prisma/client.ts";

declare global {
  namespace Express {
    interface Request {
      validated: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };

      user: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export {};