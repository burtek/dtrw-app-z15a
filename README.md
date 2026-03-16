# Generator formularzy ZUS Z-15A

A web application for generating pre-filled Polish social insurance (ZUS) **Z-15A** forms. It stores records for caretakers, children, jobs, and leaves, and can produce a completed PDF form and deliver it by e-mail.

---

## Table of contents

- [Purpose](#purpose)
- [Architecture](#architecture)
- [Repository structure](#repository-structure)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install dependencies](#install-dependencies)
  - [Run in development mode](#run-in-development-mode)
- [Available scripts](#available-scripts)
- [Environment variables](#environment-variables)
- [Docker deployment](#docker-deployment)
- [CI/CD](#cicd)
- [Versioning](#versioning)

---

## Purpose

The Z-15A form is used to claim a care allowance from the Polish Social Insurance Institution (ZUS) when a parent or guardian is unable to work due to caring for a sick child. This application provides:

- A persistent store (SQLite) for **caretakers**, **children**, **jobs** (ZUS payers), and **leaves** (absences).
- A REST API that generates a fully pre-filled Z-15A PDF from the stored data.
- An option to send the generated PDF directly by e-mail.
- A React single-page application that lets users manage their data and trigger PDF generation from a browser.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Browser (React SPA)                           │
│  packages/frontend  –  port 3000 (dev) / nginx (production)      │
│                                                                  │
│  Tabs: Leaves · Caretakers · Kids · Jobs                         │
│  Redux Toolkit + RTK Query  ──►  REST API calls (/api/*)         │
└──────────────────────┬───────────────────────────────────────────┘
                       │  HTTP  (proxied to :4000 in dev)
┌──────────────────────▼───────────────────────────────────────────┐
│                  Fastify REST API                                │
│  packages/backend  –  port 4000                                  │
│                                                                  │
│  Routes:                                                         │
│    GET/POST  /kids        – child records                        │
│    GET/POST  /leaves      – absence records                      │
│    GET/POST  /jobs        – employer records                     │
│    GET/POST  /caretakers  – guardian records                     │
│    POST      /pdf         – generate & e-mail Z-15A PDF          │
│    GET       /health      – liveness probe                       │
│                                                                  │
│  Zod validation · Drizzle ORM · pdf-lib · Nodemailer             │
└──────────────────────┬───────────────────────────────────────────┘
                       │
               SQLite database
       (better-sqlite3 + Drizzle ORM)
```

In **production** both packages are built and deployed to a VPS via GitHub Actions:

- The frontend `dist/` is served by **nginx:alpine**.
- The backend `dist/` runs inside a **node:24-alpine** container.
- Both containers share a Docker network called `apps`.

---

## Repository structure

```
dtrw-app-z15a/
├── packages/
│   ├── backend/       # Fastify API server
│   └── frontend/      # React SPA (Vite)
├── docker/
│   ├── backend/env    # Docker env-file template for the backend
│   └── frontend/      # nginx config for the SPA
├── docker-compose.yml # Production orchestration
├── lerna.json         # Monorepo config (Lerna + Yarn workspaces)
├── package.json       # Root scripts & workspace definitions
└── CHANGELOG.md       # Auto-generated version history
```

Each package has its own `README.md` with package-specific details:

- [`packages/backend/README.md`](packages/backend/README.md)
- [`packages/frontend/README.md`](packages/frontend/README.md)

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19, TypeScript 5 |
| Frontend build | Vite 8 |
| State & API layer | Redux Toolkit, RTK Query |
| UI components | Radix UI Themes |
| Forms | React Hook Form |
| Backend framework | Fastify 5, TypeScript 5 |
| Backend build | Rollup 4 |
| Database | SQLite (better-sqlite3) |
| ORM | Drizzle ORM |
| Validation | Zod |
| PDF generation | pdf-lib |
| E-mail | Nodemailer |
| Testing | Vitest, React Testing Library, MSW |
| Linting | ESLint |
| Monorepo tooling | Yarn Workspaces, Lerna 9 |
| Runtime | Node.js ≥ 24 |
| Containerisation | Docker, nginx |
| CI/CD | GitHub Actions |

---

## Getting started

### Prerequisites

- **Node.js ≥ 24** (`node --version`)
- **Yarn** (`npm install -g yarn`)

### Install dependencies

```bash
yarn install
```

### Run in development mode

```bash
yarn dev
```

This starts both the frontend dev server (`http://localhost:3000`) and the backend API server (`http://localhost:4000`) concurrently. The Vite dev server proxies `/api` requests to the backend automatically.

> **Note:** The backend requires environment variables for e-mail and the database path. Copy `docker/backend/env` to `packages/backend/.env` and fill in the values before running. See [Environment variables](#environment-variables) for details.

---

## Available scripts

All scripts can be run from the repository root using Yarn / Lerna, which delegates to each package.

| Command | Description |
|---|---|
| `yarn dev` | Start both packages in development / watch mode |
| `yarn build` | Build both packages for production |
| `yarn test` | Run all unit tests |
| `yarn lint` | Lint all packages |
| `yarn release` | Bump version and update `CHANGELOG.md` |

See the package READMEs for package-specific scripts.

---

## Environment variables

The backend reads its configuration from environment variables (validated at startup with Zod):

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | yes | `development` / `production` / `test` |
| `PORT` | no | HTTP port (default: `4000`) |
| `DB_FILE_NAME` | yes | Path to the SQLite database file |
| `DB_MIGRATIONS_FOLDER` | yes | Path to the Drizzle migrations directory |
| `EMAIL_SMTP_USER` | yes | SMTP login (e-mail address) |
| `EMAIL_SMTP_PASS` | yes | SMTP password |
| `EMAIL_FROM` | yes | Sender address used in generated e-mails |
| `LOGS_FILE` | no | Path for file-based logging |

In Docker the variables are supplied via `docker/backend/env` and an optional `.env.backend` file.

---

## Docker deployment

The `docker-compose.yml` at the repository root is used for **production** deployments. Before using it, build both packages first:

```bash
yarn build
```

Then copy the build artefacts to the expected locations and start the services:

```bash
# build artefacts are copied to ./frontend and ./backend by the deploy workflow
docker compose up -d
```

The frontend container serves the React app on port 80 via nginx. The backend container exposes port 4000 internally on the `apps` Docker network (not published to the host).

---

## CI/CD

Three GitHub Actions workflows are defined in `.github/workflows/`:

| Workflow | Trigger | Purpose |
|---|---|---|
| `test-pr.yaml` | Pull request → `master` | Install, test, lint, build |
| `release.yaml` | Push to `master` | Bump version, update changelog, push tag |
| `deploy.yaml` | Tag push (`v*`) | Build artefacts and deploy to VPS via SCP/SSH |

---

## Versioning

The project uses [Conventional Commits](https://www.conventionalcommits.org/) (enforced by Husky + commitlint) and [standard-version](https://github.com/conventional-changelog/standard-version) for automated changelog generation and semantic version bumping. Each package is versioned independently via Lerna.
