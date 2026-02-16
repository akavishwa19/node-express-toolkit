# Node express toolkit with eslint , prettier , jest , typescript

A small starter toolkit for building Node + Express APIs in TypeScript with:
- structured project layout (controllers, services, models, middleware, routes)
- environment validation and bootstrap helpers
- simple user resource implemented as example
- Jest configured for tests and coverage output

This repository is intended as a template you can fork and adapt for small services.

## What this project does

- Exposes a minimal HTTP API with a health endpoint (`GET /healthz`) and a user resource under `/api/v1/users`.
- Validates request payloads using Zod via the [`schemaValidation`](src/middleware/schemaValidation.ts) middleware.
- Centralizes error handling using the [`globalErrorHandler`](src/middleware/globalErrorHandler.ts).
- Provides a `UserService` that orchestrates data access through the `Users` model (`src/services/user.ts`, `src/models/user.ts`).
- Validates required environment variables at startup (`src/utils/validateEnv.ts`) and connects to a MySQL database (`src/db/client.ts`).

## Quick links
- Application entry: [src/app.ts](src/app.ts) — bootstraps server, routes and DB.
- Error middleware: [`globalErrorHandler`](src/middleware/globalErrorHandler.ts) ([file](src/middleware/globalErrorHandler.ts)).
- Validation middleware: [`schemaValidation`](src/middleware/schemaValidation.ts) ([file](src/middleware/schemaValidation.ts)).
- Routes: [src/routes/user.ts](src/routes/user.ts)
- Services: [src/services/user.ts](src/services/user.ts)
- Models: [src/models/user.ts](src/models/user.ts)
- Env validation: [src/utils/validateEnv.ts](src/utils/validateEnv.ts)
- Tests: [tests/app.test.ts](tests/app.test.ts)
- Package.json scripts: [package.json](package.json)
- Coverage report (generated): [coverage/lcov-report/index.html](coverage/lcov-report/index.html)

## Requirements

- Node 24+ 
- Yarn or npm
- A MySQL database 

Environment variables are defined in `ENVIRONMENT.MD`. The project will run env validation on startup

## Installation

```sh
npm install
```