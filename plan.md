# AeroWorks Operations Control Center — Implementation Plan

## Purpose

A Power Apps Code App learning project that teaches three things at once:

1. **AI-assisted development with GitHub** in a GH-600-style workflow (issues → branches →
   Copilot-assisted changes → PRs → reviews → CI gates).
2. **TypeScript and React best practices** (strict typing, feature-based architecture,
   repository pattern, testable domain logic, TanStack Query).
3. **Power Apps Code Apps capabilities and conventions** (official templates, the
   Power Apps Code Apps SDK/CLI, generated data sources, and Power Platform ALM).

## Repository state

Empty scaffold (README, LICENSE, .gitignore, this plan). Greenfield Vite + React +
TypeScript project following Microsoft's Power Apps Code Apps conventions.

## Scaffold direction (Code Apps first, not plain Vite)

Scaffold from the **official Microsoft PowerAppsCodeApps `starter` template**
(`microsoft/PowerAppsCodeApps/templates/starter`, via `degit`), which is Microsoft's
recommended starting point and ships pre-configured for Code Apps with React, Vite,
Tailwind CSS, TanStack Query, and React Router — exactly the stack this project needs.

- Fallback option: the official minimal **`vite` Code Apps template**
  (`microsoft/PowerAppsCodeApps/templates/vite`) if we decide the first iteration should
  stay lean (fewer preinstalled UI libraries to explain in a learning context). It is still
  preconfigured for Code Apps, so no conventions are lost.
- Plain `npm create vite@latest` is **not** used. It would require manually re-adding the
  Code Apps SDK (`@microsoft/power-apps`), the Vite plugin (`@microsoft/power-apps-vite`),
  `power.config.json`, and port/host conventions — needless risk and drift from official
  guidance with no benefit for this project.

The template brings the Code Apps essentials we must preserve:
- `@microsoft/power-apps` SDK (runtime dependency)
- `@microsoft/power-apps-vite` Vite plugin (dev dependency)
- Code-Apps-ready `vite.config.ts` and project conventions

## Tooling direction (npm-based Code Apps CLI, not PAC-first)

This is **not** a "pac code generated app structure" project. The plan follows the current
npm-based Power Apps Code Apps CLI direction for init/run/push where supported: the app is
an npm project whose lifecycle (dev server, build, publish) runs through npm scripts and the
Code Apps SDK/CLI tooling that ships with `@microsoft/power-apps`.

PAC (`pac`) commands are referenced **only** where current Microsoft docs still require or
document them, notably:
- `pac auth` for tenant authentication (Phase 2 only)
- `pac code init --environment <id> --displayName <name>` where docs still document it for
  environment binding (Phase 2 only)
- `pac code add-data-source` for generating typed models/services from connectors and
  Dataverse tables (Phase 2 only)

Before Phase 2 begins, re-check the official docs (aka.ms/pacodeapps) — the npm-based CLI
is actively absorbing PAC responsibilities, and any command still listed above may have an
npm-based equivalent by then.

## Phasing

### Phase 1 — Local-only app shell (this project's first implementation phase)

Everything in Phase 1 runs locally with **no tenant authentication and no Power Platform
calls**. Deliverables:

- React app shell from the official starter template
- Routing (React Router)
- Mock data behind repository interfaces (see architecture below)
- Domain logic + unit tests (Vitest)
- CI (GitHub Actions: lint, typecheck, test, build)
- Project instructions (`.github/copilot-instructions.md`) and contributor documentation
- Updated root `README.md`

Explicitly **out of scope** for Phase 1 (and for the task that implements it):
`power-apps init`, `power-apps push`, `pac auth`, `pac code init`,
`pac code add-data-source`, connector setup, environment selection, Dataverse connection
setup, and any deployment command.

### Phase 2 — Power Platform integration (deferred; run/reviewed deliberately by the owner)

- Tenant authentication (`pac auth` or current npm-based equivalent)
- Environment selection and app registration/init
- Dataverse tables + connector setup
- Generate typed models/services into `src/generated` (`pac code add-data-source` or
  current documented equivalent)
- Swap mock repositories for generated-service-backed repositories (behind the same
  interfaces — no UI/hook changes expected)
- First push/publish to the Power Apps environment and smoke test

### Phase 3 — Hardening and learning extensions

- AI triage logic against real data, telemetry wiring, role-based admin behavior,
  E2E tests (Playwright), release/ALM notes.

## Architecture

### Folder structure (feature-based, layered)

```
src/
  app/
    layout/                 # AppLayout, NavSidebar
    providers/              # QueryProvider (TanStack Query), future auth/telemetry providers
    router.tsx
    App.tsx
  features/
    assets/
      domain/               # Asset model/types, health-status logic
      data/                 # AssetRepository interface + MockAssetRepository
      hooks/                # useAssets(), useAsset(id) — TanStack Query
      ui/                   # AssetsPage, asset components
    inspections/
      domain/               # Inspection types, isInspectionOverdue()
      data/
      hooks/
      ui/
    incidents/
      domain/
      data/
      hooks/
      ui/
    workOrders/
      domain/               # WorkOrder types, prioritization logic
      data/
      hooks/
      ui/
    aiTriage/
      domain/               # TriageException types, prioritizeTriageExceptions()
      data/
      hooks/
      ui/
    admin/
      ui/                   # AdminPage (static in Phase 1)
    dashboard/
      domain/               # cross-feature summary calculations
      hooks/
      ui/                   # DashboardPage
    notFound/
      ui/                   # NotFoundPage (404 route)
  generated/
    README.md               # placeholder + rules for generated Code Apps output
  shared/
    components/             # generic UI building blocks
    utils/                  # generic helpers (dates, formatting)
    telemetry/              # logging/telemetry abstraction (console-backed in Phase 1)
    types/                  # cross-feature shared types
```

Each feature contains:
- **domain/** — models/types and feature-local business logic where needed
- **data/** — a repository *interface* plus a *mock repository implementation*
- **hooks/** — TanStack Query hooks consuming the repository
- **ui/** — components and pages

### Generated services (`src/generated`)

- Generated Power Apps Code Apps models/services belong under `src/generated`.
- Generated files must **not** be manually edited — they are overwritten on regeneration.
- Handwritten feature code must never import generated services directly; it wraps them
  behind the repository/adapter interfaces in each feature's `data/` folder.
- Phase 1 ships only `src/generated/README.md` documenting these rules.

### Repository pattern

Every feature defines a repository interface in `data/`, e.g.:

```ts
export interface AssetRepository {
  listAssets(): Promise<Asset[]>;
  getAsset(id: string): Promise<Asset | undefined>;
}
```

- Phase 1 provides `MockAssetRepository` (and equivalents per feature): async, promise-based
  implementations backed by typed in-memory mock datasets, intentionally shaped to match the
  call patterns of Dataverse/generated services (async list/get/create/update, id-based
  lookups, paging-friendly signatures where relevant).
- Phase 2 provides `DataverseAssetRepository` adapters wrapping the generated services in
  `src/generated` behind the same interfaces.
- Hooks and UI depend only on the interface (provided via a simple factory or React
  context), so swapping mock → Dataverse requires no changes above the data layer.

### Routing

React Router routes: `/` (Dashboard), `/assets`, `/inspections`, `/incidents`,
`/work-orders`, `/ai-triage`, `/admin`, and a `*` catch-all rendering
`features/notFound/ui/NotFoundPage`. `AppLayout` renders persistent navigation + `<Outlet />`.

### Data layer

- TanStack Query hooks per feature (`useAssets`, `useInspections`, …) call repositories;
  query keys namespaced per feature.
- `QueryProvider` in `src/app/providers` wraps the app with `QueryClientProvider`.

## Quality & workflow

### TypeScript / lint

- Strict TypeScript (`"strict": true`, `noUnusedLocals`, `noUnusedParameters`,
  `noImplicitReturns`); keep/extend the template's ESLint flat config.

### Tests

- Vitest + Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `jsdom`)
  added as dev dependencies (the starter template does not include a test runner).
- Unit tests for domain logic (e.g., `computeAssetHealthStatus`, `isInspectionOverdue`,
  `prioritizeTriageExceptions`) and for mock repositories; at least one component test per
  page shell.
- `npm run test` script; tests run in CI.

### CI (GitHub Actions)

- `ci.yml` on PRs and pushes to `main`: install, lint, typecheck (`tsc -b`), test, build.
- No Power Platform credentials in CI during Phase 1.

### GH-600-style workflow & project instructions

- `.github/copilot-instructions.md` documenting architecture rules (feature folders, repository
  pattern, no direct imports from `src/generated`, testing expectations) so AI-assisted
  changes stay on-convention.
- Work tracked via issues; small focused PRs; CI required before merge.

## Phase 1 files to create

- Template-provided (from starter): `package.json`, `vite.config.ts`, `index.html`,
  `tsconfig*.json`, `eslint.config.js`, `power.config.json`/SDK wiring as shipped,
  `src/main.tsx`, base styles
- `src/app/App.tsx`, `src/app/router.tsx`, `src/app/providers/QueryProvider.tsx`,
  `src/app/layout/AppLayout.tsx`, `src/app/layout/NavSidebar.tsx`
- Per feature (`assets`, `inspections`, `incidents`, `workOrders`, `aiTriage`):
  `domain/` types + logic (+ `*.test.ts` where logic exists), `data/` repository interface +
  mock implementation + mock dataset, `hooks/` query hooks, `ui/` page
- `src/features/admin/ui/AdminPage.tsx`, `src/features/dashboard/{domain,hooks,ui}/…`,
  `src/features/notFound/ui/NotFoundPage.tsx`
- `src/generated/README.md`
- `src/shared/{components,utils,telemetry,types}/` starters
- `vitest.config.ts` (or merged into `vite.config.ts`)
- `.github/workflows/ci.yml`, `.github/copilot-instructions.md`
- `.env.example` placeholder (no real values)
- Updated root `README.md` (overview, structure, run instructions, phase roadmap)

## Files to modify

- `README.md` (project description, structure, local run instructions)
- `.gitignore` (verify Code Apps/Vite entries after scaffolding; template ships its own)
