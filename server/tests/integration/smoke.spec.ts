import request from "supertest";

import { app } from "../../src/app.js";
import { prisma } from "../../src/db/prisma.js";

if (!process.env.DATABASE_URL?.includes("team_task_board_test")) {
  throw new Error("Tests must use the test database");
}

beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("smoke test", () => {
  it("proves the main request flow", async () => {
    const agent = request.agent(app);

    const healthResponse = await request(app).get("/health");
    expect(healthResponse.status).toBe(200);

    const registerResponse = await agent.post("/api/v1/auth/register").send({
      name: "Test User",
      email: "test-user@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });

    expect(registerResponse.status).toBe(201);
    expect(String(registerResponse.headers["set-cookie"])).toContain("HttpOnly");

    const meResponse = await agent.get("/api/v1/auth/me");
    expect(meResponse.status).toBe(200);

    const projectResponse = await agent.post("/api/v1/projects").send({
      name: "Smoke Project",
    });

    expect(projectResponse.status).toBe(201);

    const unauthenticatedResponse = await request(app).get("/api/v1/projects");
    expect(unauthenticatedResponse.status).toBe(401);
  });
});
