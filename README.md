# AeroWorks Operations Control Center

A Power Apps Code App learning project: a Vite + React + TypeScript app for **AeroWorks**,
a fictitious airport/facilities operator. Operations teams use it to manage operational
assets, inspections, incidents, work orders, and high-risk exception triage.

The project teaches three things at once:

1. **AI-assisted development with GitHub** in a GH-600-style workflow (issues → branches →
   Copilot-assisted changes → PRs → reviews → CI gates).
2. **TypeScript and React best practices** (strict typing, feature-based architecture,
   repository pattern, testable domain logic, TanStack Query).
3. **Power Apps Code Apps capabilities and conventions** (official templates, the
   Code Apps SDK/CLI, generated data sources, and Power Platform ALM).

See [`plan.md`](plan.md) for the full project master roadmap.

## Current status: Phase 1 — local app shell

Everything runs **locally on mock data**: no tenant authentication, no Power Platform
calls, and no deployment. The app is scaffolded from the official Microsoft
[PowerAppsCodeApps `starter` template](https://github.com/microsoft/PowerAppsCodeApps)
and keeps its Code Apps essentials (`@microsoft/power-apps` SDK,
`@microsoft/power-apps-vite` plugin, Vite/port conventions) for later phases.

| Phase | Scope |
|---|---|
| 0 | Planning and GitHub guardrails ✅ |
| 1 | Local React/TypeScript app shell on mock data ✅ (this phase) |
| 2 | Code Apps local integration (init, run in Power Apps host, first push) |
| 3 | Dataverse integration (`aw_*` tables, generated services behind repositories) |
| 4 | Platform integrations (SharePoint evidence, Power Automate approvals, Teams/Outlook, Copilot Studio) |
| 5 | ALM, governance, observability |

## Getting started

```bash
npm install
npm run dev       # local dev server
```

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check (`tsc -b --noEmit`) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest single run (used in CI) |
| `npm run test:watch` | Vitest watch mode |
| `npm run preview` | Preview production build |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, test, and build on every PR and
push to `main`.

## Architecture

Feature-based folders with four layers per feature; hooks and UI depend only on
repository *interfaces*, so the Phase 3 mock → Dataverse swap is a data-layer change.

```
src/
  app/                    # App wiring: layout, providers, router
  features/
    assets/               # aw_asset        — domain/ data/ hooks/ ui/
    inspections/          # aw_inspection   — domain/ data/ hooks/ ui/
    incidents/            # aw_incident     — domain/ data/ hooks/ ui/
    workOrders/           # aw_workorder    — domain/ data/ hooks/ ui/
    aiTriage/             # aw_exceptionrequest — domain/ data/ hooks/ ui/
    dashboard/            # cross-feature KPI summary
    admin/                # static in Phase 1 (aw_setting-driven in Phase 3)
    notFound/             # 404 route
  generated/              # reserved for Code Apps CLI output (Phase 3) — see its README
  shared/
    components/           # LoadingState, ErrorState, EmptyState
    telemetry/            # console-backed abstraction (App Insights in Phase 5)
    types/                # cross-feature shared types
    utils/                # date helpers, mock latency
```

- **Repository pattern**: each feature defines a repository interface in `data/` with an
  async, promise-based mock implementation backed by typed in-memory datasets shaped
  toward the future `aw_*` Dataverse model.
- **Routing**: `/` (dashboard), `/assets`, `/inspections`, `/incidents`, `/work-orders`,
  `/ai-triage`, `/admin`, plus a `*` not-found route.
- **UI states**: every feature page demonstrates loading, error, empty, and populated
  states via the shared state components.
- **Generated code** is off-limits for hand edits and never imported directly — see
  [`src/generated/README.md`](src/generated/README.md).

## Testing

Vitest + Testing Library. Priorities: domain logic (health status, overdue inspections,
work order ranking, triage prioritization, dashboard KPIs), repository behavior
(id lookups incl. not-found), and component tests only for meaningful state behavior
(loading/error/empty/populated and routing).

## Contributing

Work is tracked via issues (feature / bug / AI agent task templates), one branch per
issue, small focused PRs using the PR template, and CI required before merge. See
`.github/BRANCH_PROTECTION.md` and the instruction files under `.github/instructions/`.
