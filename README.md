# Team Task Board

A learning-first full-stack Node.js technical assessment. The repository contains a separate
Express REST API and Next.js App Router frontend. PostgreSQL is the only containerized service.

## Setup status

Tooling and folder structure are prepared. Business logic, Prisma models, routes, controllers,
services, middleware, feature pages, hooks, and API calls will be typed manually one file at a
time.

## Technology stack

- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod, JWT, bcryptjs
- Testing: Jest, Supertest, and `@swc/jest`
- Frontend: Next.js App Router, React, Tailwind CSS, shadcn/ui, TanStack Query, Axios
- Infrastructure: Docker Compose for PostgreSQL only

## Technical Decisions

TypeScript 6.0.3 was selected instead of TypeScript 7 because the current typescript-eslint toolchain used by eslint-config-next officially supports TypeScript versions below 6.1.0. This keeps the backend and frontend linting toolchain supported and reproducible.

- TypeScript is pinned exactly in both applications and both lockfiles are committed.
- JWTs will be stored in HTTP-only cookies; tokens and password hashes must never be exposed.
- Passwords will use one-way bcryptjs hashing, not reversible encryption.
- Prisma queries will stay in feature services; a repository layer is intentionally omitted.
- `Project.ownerId` is the ownership source of truth; `ProjectMember` only records membership.
- Global admins can manage all projects. Regular members are limited to joined projects.
- Redis, WebSockets, Kanban, drag-and-drop, and bonus features are outside the core scope.

## Local prerequisites

- Node.js 22.12 or newer
- npm
- Docker Desktop with Docker Compose

## Environment setup

1. Copy `server/.env.example` to `server/.env` for the backend and Docker Compose.
2. Copy `server/.env.test.example` to a local test environment file when tests are implemented.
3. Copy `client/.env.local.example` to `client/.env.local`.
4. Replace every placeholder secret before sharing or deploying.

## Database

```powershell
cd server
docker compose up -d postgres
docker compose ps
```

The initialization script creates empty `team_task_board` and `team_task_board_test` databases.
It does not create application tables. Do not run a migration until the real Prisma schema has
been manually typed and reviewed.

## Development commands

Backend:

```powershell
cd server
npm install
npm run typecheck
npm run lint
```

Frontend:

```powershell
cd client
npm install
npm run typecheck
npm run lint
npm run build
```

## Documentation

- Postman artifacts are under `docs/postman/`.
- Static UI references and ordered screenshots are in the sibling
  `team-task-board-mockups/` Desktop folder.

## Future improvements

Potential post-assessment enhancements include refresh-token rotation, email invitations,
pagination, audit logs, background jobs, and Redis caching after a measured need is established.
