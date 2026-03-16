# frontend

React single-page application for the Z-15A form generator. It provides a tabbed interface for managing caretakers, children, jobs, and leaves, and lets users trigger PDF generation via the backend API.

---

## Table of contents

- [Overview](#overview)
- [Source structure](#source-structure)
- [Features](#features)
- [Scripts](#scripts)
- [Building](#building)
- [Testing](#testing)

---

## Overview

| | |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Language** | TypeScript 5 |
| **Build tool** | [Vite 8](https://vitejs.dev/) |
| **State management** | [Redux Toolkit](https://redux-toolkit.js.org/) + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) |
| **UI components** | [Radix UI Themes](https://www.radix-ui.com/themes/docs/overview/getting-started) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) |
| **Testing** | [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [MSW](https://mswjs.io/) |

The frontend communicates with the backend exclusively through RTK Query. In development, Vite proxies requests under `/api` to `http://localhost:4000`.

---

## Source structure

```
src/
├── main.tsx                   # React entry point
├── App.tsx                    # App shell: top-level tabs, header, dialogs
├── App.test.tsx               # Smoke tests for the App component
├── components/
│   ├── data-view/             # Generic table and card-list display components
│   ├── form/                  # Reusable form field components
│   ├── dialogs/               # About, GDPR / Privacy Policy, Disclaimer dialogs
│   └── withErrorBoundary.tsx  # HOC wrapping a component in an error boundary
├── redux/
│   ├── store.ts               # Redux store configuration
│   └── apis/                  # RTK Query slices
│       ├── caretakers.ts
│       ├── health.ts
│       ├── jobs.ts
│       ├── kids.ts
│       └── leaves.ts
├── tabs/                      # One directory per tab (lazy-loaded)
│   ├── caretakers/
│   ├── jobs/
│   ├── kids/
│   └── leaves/
├── types/                     # Shared TypeScript type definitions
└── utils/                     # Utility / helper functions
```

---

## Features

- **Tabbed interface** – Leaves, Caretakers, Kids, and Jobs tabs, each rendered as a separate lazy-loaded chunk.
- **Full CRUD** – Create, edit, and delete records directly from the UI using modal dialogs.
- **PDF generation** – Trigger Z-15A PDF creation and optional e-mail delivery from the UI.
- **Health indicator** – The header shows a real-time API health status fetched from `GET /health`.
- **GDPR consent** – A consent dialog with a 31-day rolling expiry; consent version is tracked in `localStorage`.
- **Responsive navigation** – Dropdown menus on desktop, hamburger menu on mobile.
- **Error boundaries** – Each tab is wrapped in an error boundary to prevent one failing section from crashing the whole app.
- **Toast notifications** – User-facing feedback for API success and error responses via react-toastify.

---

## Scripts

| Command | Description |
|---|---|
| `yarn dev` / `yarn start:dev` | Start the Vite dev server at `http://localhost:3000` |
| `yarn build` | Type-check (`tsc -b`) and build for production to `dist/` |
| `yarn preview` | Serve the production build locally for inspection |
| `yarn test` | Run unit and component tests once with Vitest |
| `yarn test:watch` | Run tests in interactive watch mode |
| `yarn lint` | Lint with ESLint |

---

## Building

```bash
yarn build
```

The output is written to `dist/`. In production the `dist/` directory is served by an **nginx:alpine** container (see `../../docker/frontend/nginx.conf`) configured with `try_files` to support client-side routing.

---

## Testing

Tests use Vitest as the runner, React Testing Library for component interaction, and MSW for mocking API requests.

```bash
# run once
yarn test

# interactive watch mode
yarn test:watch
```

Test files live alongside the source files they test (e.g. `App.test.tsx` next to `App.tsx`).
