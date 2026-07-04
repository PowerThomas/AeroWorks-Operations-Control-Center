# AeroWorks Operations Control Center — Project Master Roadmap

## Purpose

A Power Apps Code App learning project that teaches three things at once:

1. **AI-assisted development with GitHub** in a GH-600-style workflow (issues → branches →
   Copilot-assisted changes → PRs → reviews → CI gates).
2. **TypeScript and React best practices** (strict typing, feature-based architecture,
   repository pattern, testable domain logic, TanStack Query).
3. **Power Apps Code Apps capabilities and conventions** (official templates, the
   Power Apps Code Apps SDK/CLI, generated data sources, and Power Platform ALM).

This document is the **project master roadmap** — it covers the full lifecycle from
planning through ALM/governance, not only the first implementation phase.

## Business scenario

**AeroWorks** is a fictitious airport/facilities operator. Its operations teams manage:

- **Operational assets** — jet bridges, baggage systems, HVAC units, ground support
  equipment, and similar infrastructure spread across operational zones.
- **Inspections** — scheduled and ad-hoc checks against assets, with due dates,
  outcomes, and follow-ups.
- **Incidents** — reported faults, safety events, and disruptions tied to assets/zones.
- **Work orders** — corrective and preventive maintenance work, prioritized and assigned
  to technicians.
- **High-risk exceptions** — situations that need explicit review/approval before
  operations continue (e.g., operating an asset with an overdue safety inspection).
- **Evidence files** — photos, reports, and documents attached to inspections,
  incidents, and exception requests.

### Personas

| Persona | What they need from the app |
|---|---|
| **Operations Manager** | Dashboard overview, KPIs, exception approvals, workload distribution |
| **Field Technician** | Assigned work orders, inspection checklists, evidence upload, quick incident reporting |
| **Safety Coordinator** | Incident review, high-risk exception oversight, audit notes, compliance trail |
| **IT/Admin** | App settings, reference data, access/governance, environment health |
| **AI Assistant User** | Any of the above interacting via the AI triage assistant (natural-language triage, summaries, suggested prioritization) |

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

**Phase 2 starts with a CLI decision checkpoint.** Prefer the current npm-based
`power-apps` CLI for init/run/push where supported. Use `pac code` only where the current
Microsoft docs or selected template still require it, especially for data-source
generation and connection-reference operations.

For authentication, prefer the npm-based Power Apps CLI flow (`power-apps login`,
`power-apps auth-status`, `power-apps auth-switch`, and the automatic sign-in during
`power-apps init`) where supported. Use `pac auth` only when the current command path
still depends on PAC CLI, such as specific `pac code` or solution-management operations
documented by Microsoft.

Before Phase 2 begins, re-check the official docs (aka.ms/pacodeapps) — the npm-based CLI
is actively absorbing PAC responsibilities.

## Proposed future Dataverse data model

Phase 1 uses **mocks only** — no Dataverse connection exists until Phase 3. However, mock
domain types must be intentionally shaped toward this future model so the later swap is a
data-layer change, not a domain rewrite.

| Table (logical name) | Purpose | Key relationships |
|---|---|---|
| `aw_asset` | Operational assets (jet bridges, HVAC, GSE, …): name, type, status, health, criticality | → `aw_operationalzone` |
| `aw_operationalzone` | Physical/logical zones (terminals, aprons, plant rooms) | parent of assets |
| `aw_inspection` | Scheduled/ad-hoc inspections: due date, outcome, inspector, checklist result | → `aw_asset` |
| `aw_incident` | Faults, safety events, disruptions: severity, status, reporter | → `aw_asset`, `aw_operationalzone` |
| `aw_workorder` | Corrective/preventive work: priority, assignee, due date, linked source record | → `aw_asset`, `aw_incident`, `aw_inspection` |
| `aw_exceptionrequest` | High-risk exception requests requiring review/approval; drives the AI triage feature | → `aw_asset`, `aw_incident` |
| `aw_auditnote` | Append-only audit/compliance notes attached to any operational record | polymorphic-style lookup(s) |
| `aw_setting` | App configuration and reference data managed by IT/Admin | standalone |

Evidence files are stored in **SharePoint** (Phase 4), linked from inspections, incidents,
and exception requests — not as Dataverse file columns, to exercise the SharePoint
connector capability.

## Code Apps feature coverage matrix

| Capability | Phase | Notes |
|---|---|---|
| Official `starter` template | 1 | Scaffold basis |
| npm CLI init/run/push | 2 | After the CLI decision checkpoint |
| Dataverse CRUD | 3 | Via generated services behind repositories |
| Generated services (`src/generated` + generator-specific paths) | 3 | Never hand-edited; wrapped by adapters |
| Dataverse actions/functions | 3 | E.g., exception approval state transitions |
| SharePoint evidence storage | 4 | Evidence files for inspections/incidents/exceptions |
| Power Automate approval flow | 4 | Exception request approvals |
| Teams/Outlook notifications | 4 | Work order assignment + approval outcomes |
| Copilot Studio triage assistant | 4 | Backs the AI Triage feature |
| Azure SQL (only if justified) | 4 | Only for historical telemetry/trends if Dataverse is a poor fit; requires explicit justification before adoption |
| App Insights | 5 | Wire `shared/telemetry` abstraction to real telemetry |
| CSP | 5 | Content Security Policy configuration + verification |
| iframe embedding test | 5 | Validate hosting behavior (e.g., Teams/portal embedding) |
| ALM | 5 | Solution-aware deployment, preferred solution, Power Platform Pipelines |
| Connection references | 4 → 5 | Introduced with the first non-Dataverse connector in Phase 4; validated/hardened across environments in Phase 5 |
| Environment variables | 5 | Config per environment (URLs, feature flags) |

## Roadmap

### Phase 0 — Planning and guardrails

- This plan (master roadmap) reviewed and merged.
- GitHub workflow guardrails in place before code lands:
  - `.github/pull_request_template.md`
  - `.github/ISSUE_TEMPLATE/feature.yml`
  - `.github/ISSUE_TEMPLATE/bug.yml`
  - `.github/ISSUE_TEMPLATE/ai-agent-task.yml`
  - `.github/CODEOWNERS`
- Copilot instruction files:
  - `.github/copilot-instructions.md` — repo-wide architecture rules (feature folders,
    repository pattern, no direct imports from `src/generated` or other generated
    output paths, testing expectations)
  - `.github/instructions/react.instructions.md` — React/TypeScript conventions
  - `.github/instructions/power-platform.instructions.md` — Code Apps/Dataverse conventions
  - `.github/instructions/testing.instructions.md` — testing strategy and expectations
- Branch protection + CI-required-before-merge policy documented.

### Phase 1 — Local React/TypeScript app shell

Everything in Phase 1 runs locally with **no tenant authentication and no Power Platform
calls**. Deliverables:

- React app shell from the official starter template
- Routing (React Router) incl. not-found route
- Mock data behind repository interfaces (see architecture below), typed toward the
  future Dataverse model
- Shared UI state components (see below); every feature page demonstrates loading, empty,
  error, and populated states where applicable
- Domain logic + unit tests (Vitest)
- CI (GitHub Actions: lint, typecheck, test, build)
- Updated root `README.md`

Explicitly **out of scope** for Phase 1: `power-apps init`, `power-apps push`, `pac auth`,
`pac code init`, `pac code add-data-source`, connector setup, environment selection,
Dataverse connection setup, and any deployment command.

### Phase 2 — Code Apps local integration (run/reviewed deliberately by the owner)

- **CLI decision checkpoint** (see Tooling direction): confirm the current split between
  the npm-based `power-apps` CLI and `pac code` against live Microsoft docs.
- Tenant authentication and environment selection.
- App init/registration against the chosen environment.
- Local run inside the Power Apps host (SDK handshake verified) — still on mock data.
- First push/publish of the mock-backed shell and smoke test.

### Phase 3 — Dataverse integration

- Create the `aw_*` tables (see data model) in a dev environment, solution-aware.
- Generate typed models/services (data-source generation via `pac code` where docs still
  require it) into the CLI's output paths — usually `src/generated` for Dataverse (see
  Generated code section).
- Implement Dataverse-backed repository adapters (`DataverseAssetRepository`, …) behind the
  existing interfaces — no UI/hook changes expected.
- Dataverse actions/functions for multi-step operations (e.g., exception state transitions).
- Seed/reference data strategy and `aw_setting`-driven configuration.

### Phase 4 — Platform integrations

- SharePoint evidence storage (upload/list/link evidence from inspections, incidents,
  exception requests).
- **Connection references introduced here**: the first non-Dataverse connector integration
  brings the first connection references; each subsequent connector adds its own.
- Power Automate approval flow for `aw_exceptionrequest`.
- Teams/Outlook notifications (work order assignments, approval outcomes).
- Copilot Studio triage assistant backing the AI Triage feature.
- Azure SQL **only if justified** for historical telemetry/trend analysis — adoption
  requires a written justification of why Dataverse is insufficient.

### Phase 5 — ALM, governance, observability

- Solution-aware deployment: preferred solution usage, environment variables, and
  validating/hardening the connection references introduced in Phase 4 across
  dev/test/prod.
- Power Platform Pipelines for environment promotion. **GitHub remains the source of
  truth for the React/TypeScript source code.** Do not assume Solution Packager or Power
  Platform source-code-integration support for Code Apps unless Microsoft documentation
  changes.
- App Insights wired to the `shared/telemetry` abstraction.
- CSP configuration and verification; iframe embedding test.
- Role-based admin behavior hardening; audit note coverage review.
- E2E tests (Playwright) against a deployed environment.

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
    components/             # LoadingState, ErrorState, EmptyState + generic building blocks
    utils/                  # generic helpers (dates, formatting)
    telemetry/              # logging/telemetry abstraction (console-backed in Phase 1)
    types/                  # cross-feature shared types
```

Each feature contains:
- **domain/** — models/types and feature-local business logic where needed
- **data/** — a repository *interface* plus a *mock repository implementation*
- **hooks/** — TanStack Query hooks consuming the repository
- **ui/** — components and pages

### Shared UI state components (Phase 1)

- `shared/components/LoadingState.tsx`
- `shared/components/ErrorState.tsx`
- `shared/components/EmptyState.tsx`
- `features/notFound/ui/NotFoundPage.tsx`

Every feature page should demonstrate **loading, empty, error, and populated** states
where applicable, using these shared components for consistency.

### Generated code (Code Apps CLI output)

Generated output lives **wherever the current Microsoft Code Apps CLI generates it**.
Known generated areas:

- **Dataverse table/API generation** — usually under `src/generated/...`
- **Power Automate flow generation** — currently under `src/services`, `src/models`, and
  `schemas/logicflows`
- **Other connectors** — may have generator-specific output paths

Rules (applying to all generated output regardless of path):

- Generated files must **not** be manually edited — they are overwritten on regeneration.
- Handwritten feature code must never import generated services directly; it wraps them
  behind the repository/adapter interfaces in each feature's `data/` folder.
- If a generated output path falls outside `src/generated`, document it as generated
  (e.g., in its own README or the root README) and treat it with the same
  no-manual-edit rule.
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
  lookups, paging-friendly signatures where relevant) and typed toward the `aw_*` model.
- Phase 3 provides `DataverseAssetRepository` adapters wrapping the generated services in
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

### Package scripts

`package.json` must expose:

| Script | Purpose |
|---|---|
| `dev` | Local dev server |
| `build` | Production build |
| `typecheck` | `tsc --noEmit` (or `tsc -b`) as a **separate script** — must run in CI |
| `lint` | ESLint |
| `test` | Vitest single run |
| `test:watch` | Vitest watch mode |
| `preview` | Preview production build |

### Tests

- Vitest + Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `jsdom`)
  added as dev dependencies (the starter template does not include a test runner).
- Prioritize tests for **real domain logic** (e.g., `computeAssetHealthStatus`,
  `isInspectionOverdue`, `prioritizeTriageExceptions`) and **repository behavior**. Add
  component tests only for routing/layout/state behavior that can fail meaningfully, such
  as loading, empty, error, populated, and not-found states.
- `npm run test` runs in CI; `npm run test:watch` for local development.

### CI (GitHub Actions)

- `ci.yml` on PRs and pushes to `main`: install, `lint`, `typecheck`, `test`, `build` —
  each as its own step, with `typecheck` running as a separate script.
- No Power Platform credentials in CI during Phases 0–1.

### GH-600-style workflow & project instructions

- Copilot instruction files (created in Phase 0, refined as the project grows):
  - `.github/copilot-instructions.md`
  - `.github/instructions/react.instructions.md`
  - `.github/instructions/power-platform.instructions.md`
  - `.github/instructions/testing.instructions.md`
- GitHub workflow guardrails:
  - `.github/pull_request_template.md`
  - `.github/ISSUE_TEMPLATE/feature.yml`, `.github/ISSUE_TEMPLATE/bug.yml`,
    `.github/ISSUE_TEMPLATE/ai-agent-task.yml`
  - `.github/CODEOWNERS`
- Work tracked via issues; small focused PRs; CI required before merge.

## Phase 0–1 files to create

Phase 0 (guardrails):
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/feature.yml`, `.github/ISSUE_TEMPLATE/bug.yml`,
  `.github/ISSUE_TEMPLATE/ai-agent-task.yml`
- `.github/CODEOWNERS`
- `.github/copilot-instructions.md`
- `.github/instructions/react.instructions.md`,
  `.github/instructions/power-platform.instructions.md`,
  `.github/instructions/testing.instructions.md`

Phase 1 (app shell):
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
- `src/shared/components/LoadingState.tsx`, `src/shared/components/ErrorState.tsx`,
  `src/shared/components/EmptyState.tsx`
- `src/generated/README.md`
- `src/shared/{utils,telemetry,types}/` starters
- `vitest.config.ts` (or merged into `vite.config.ts`)
- `.github/workflows/ci.yml`
- `.env.example` placeholder (no real values)
- Updated root `README.md` (overview, structure, run instructions, phase roadmap)

## Files to modify

- `README.md` (project description, structure, local run instructions)
- `.gitignore` (verify Code Apps/Vite entries after scaffolding; template ships its own)
