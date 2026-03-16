# backend

Fastify REST API server for the Z-15A form generator. It manages persistent records in a SQLite database and generates pre-filled Z-15A PDFs that can be downloaded or sent by e-mail.

---

## Table of contents

- [Overview](#overview)
- [Source structure](#source-structure)
- [API routes](#api-routes)
- [Scripts](#scripts)
- [Environment variables](#environment-variables)
- [Database migrations](#database-migrations)
- [Building](#building)

---

## Overview

| | |
|---|---|
| **Framework** | [Fastify 5](https://fastify.dev/) |
| **Language** | TypeScript 5 (compiled to CommonJS via Rollup) |
| **Runtime** | Node.js ≥ 24 |
| **Database** | SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) + [Drizzle ORM](https://orm.drizzle.team/) |
| **Validation** | [Zod 4](https://zod.dev/) + [fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod) |
| **PDF generation** | [pdf-lib](https://pdf-lib.js.org/) |
| **E-mail** | [Nodemailer](https://nodemailer.com/) |
| **Testing** | [Vitest](https://vitest.dev/) |

---

## Source structure

```
src/
├── server.ts              # Entry point – creates the app and starts listening
├── app.ts                 # Fastify instance factory, registers all plugins & routes
├── config.ts              # Environment validation (Zod)
├── database/
│   ├── index.ts           # Opens the SQLite connection and runs migrations
│   └── schemas/           # Drizzle table definitions
│       ├── caretakers.ts
│       ├── jobs.ts
│       ├── kids.ts
│       └── leaves.ts
├── caretakers/            # CRUD routes for caretaker records
├── jobs/                  # CRUD routes for job/employer records
├── kids/                  # CRUD routes for child records
├── leaves/                # CRUD routes for leave/absence records
├── pdf/
│   ├── pdf.controller.ts  # POST /pdf route
│   ├── pdf.service.ts     # PDF generation logic (pdf-lib)
│   ├── mailer.service.ts  # E-mail delivery (Nodemailer)
│   ├── fieldsMap.ts       # Mapping of Z-15A form fields to PDF field names
│   └── fieldsResolvers.ts # Logic for resolving field values from records
├── health/                # GET /health liveness probe
├── dateRange/             # Date-range utility functions
├── decorators/            # Fastify decorator helpers (auth, error handling)
├── errors/                # Custom error classes
└── schemas/               # Shared Zod schemas (PESEL, NIP, bank account, …)
```

---

## API routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Liveness probe |
| `GET` | `/kids` | List all child records |
| `POST` | `/kids` | Create a child record |
| `PATCH` | `/kids/:id` | Update a child record |
| `DELETE` | `/kids/:id` | Delete a child record |
| `GET` | `/leaves` | List all leave records |
| `POST` | `/leaves` | Create a leave record |
| `PATCH` | `/leaves/:id` | Update a leave record |
| `DELETE` | `/leaves/:id` | Delete a leave record |
| `GET` | `/jobs` | List all job/employer records |
| `POST` | `/jobs` | Create a job record |
| `PATCH` | `/jobs/:id` | Update a job record |
| `DELETE` | `/jobs/:id` | Delete a job record |
| `GET` | `/caretakers` | List all caretaker records |
| `POST` | `/caretakers` | Create a caretaker record |
| `PATCH` | `/caretakers/:id` | Update a caretaker record |
| `DELETE` | `/caretakers/:id` | Delete a caretaker record |
| `POST` | `/pdf` | Generate a Z-15A PDF and optionally e-mail it |

All request and response bodies are validated with Zod schemas.

---

## Scripts

| Command | Description |
|---|---|
| `yarn build` | Compile TypeScript → `dist/` using Rollup |
| `yarn dev` | Build and run in development mode (`NODE_ENV=development`) |
| `yarn start:dev` | Watch-mode: rebuild and restart on source changes (nodemon) |
| `yarn test` | Run unit tests once (`NODE_ENV=test`) |
| `yarn test:watch` | Run unit tests in watch mode |
| `yarn lint` | Lint with ESLint |
| `yarn generate` | Generate a new Drizzle migration from schema changes |
| `yarn migrate` | Apply pending Drizzle migrations |
| `yarn check-db` | Check that schema and migrations are in sync |

---

## Environment variables

The backend validates its configuration at startup using Zod. The application will refuse to start if required variables are missing.

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | yes | — | `development` / `production` / `test` |
| `PORT` | no | `4000` | TCP port the API listens on |
| `DB_FILE_NAME` | yes | — | Absolute path to the SQLite database file |
| `DB_MIGRATIONS_FOLDER` | yes | — | Path to the `drizzle/` migrations directory |
| `EMAIL_SMTP_USER` | yes | — | SMTP username (e-mail address) |
| `EMAIL_SMTP_PASS` | yes | — | SMTP password |
| `EMAIL_FROM` | yes | — | `From` address used in outgoing e-mails |
| `LOGS_FILE` | no | — | Path for file-based log output |

Copy `../../docker/backend/env` to `.env` in this directory and fill in the values when running locally.

---

## Database migrations

Migrations are managed with [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) and stored in `drizzle/`. The server applies pending migrations automatically on startup.

To create a new migration after changing a schema file:

```bash
yarn generate
```

To apply pending migrations manually:

```bash
yarn migrate
```

---

## Building

The production build is created by Rollup and written to `dist/`:

```bash
yarn build
```

The entry point for the built artefact is `dist/index.js`. Run it with:

```bash
node --enable-source-maps dist/index.js
```
