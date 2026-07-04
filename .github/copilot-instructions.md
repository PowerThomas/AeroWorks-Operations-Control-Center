# AeroWorks Operations Control Center — Copilot instructions

AeroWorks is a Power Apps Code App learning project: a Vite + React + TypeScript app for a
fictitious airport/facilities operator (assets, inspections, incidents, work orders,
high-risk exception triage). `plan.md` at the repository root is the **master roadmap**
(Phases 0–5) — always check which phase a task belongs to and stay within its scope.

## Phase scoping

- Phases 0–1 are **local only**: no tenant authentication, no Power Platform calls, no
  `power-apps init/push`, no `pac` commands, no connector or Dataverse setup, and no
  Power Platform credentials in CI.
- Dataverse integration starts in Phase 3; other connectors (SharePoint, Power Automate,
  Teams/Outlook, Copilot Studio) start in Phase 4; ALM/governance in Phase 5.

## Architecture rules (mandatory)

- **Feature-based folders** under `src/features/<feature>/` with four layers:
  `domain/` (types + business logic), `data/` (repository interface + implementations),
  `hooks/` (TanStack Query hooks), `ui/` (components and pages). Cross-cutting code lives
  in `src/shared/` (`components`, `utils`, `telemetry`, `types`) and app wiring in
  `src/app/` (`layout`, `providers`, `router.tsx`, `App.tsx`).
- **Repository pattern**: every feature defines a repository *interface* in `data/`.
  Phase 1 ships mock implementations (async, promise-based, backed by typed in-memory
  datasets shaped toward the future `aw_*` Dataverse model). Hooks and UI depend only on
  the interface, never on a concrete implementation.
- **Generated code is off-limits for hand edits.** Code Apps CLI output lives wherever
  the CLI puts it — usually `src/generated` for Dataverse; `src/services`, `src/models`,
  and `schemas/logicflows` for Power Automate flows. Never manually edit generated files,
  and never import generated services directly from feature code — wrap them behind the
  repository/adapter interfaces in each feature's `data/` folder.
- Mock domain types must be typed toward the future Dataverse model
  (`aw_asset`, `aw_operationalzone`, `aw_inspection`, `aw_incident`, `aw_workorder`,
  `aw_exceptionrequest`, `aw_auditnote`, `aw_setting`) so the Phase 3 swap is a
  data-layer change only.

## Quality expectations

- Strict TypeScript (`"strict": true`, `noUnusedLocals`, `noUnusedParameters`,
  `noImplicitReturns`). No `any` unless unavoidable and justified.
- Tests with Vitest + Testing Library. Prioritize **real domain logic** and repository
  behavior; add component tests only for routing/layout/state behavior that can fail
  meaningfully (loading, empty, error, populated, not-found states).
- Every feature page should demonstrate loading, empty, error, and populated states using
  the shared `LoadingState`, `ErrorState`, and `EmptyState` components.
- Keep the template's ESLint flat config; run `lint`, `typecheck`, `test`, and `build`
  before considering a change done (once these scripts exist in Phase 1).

## Workflow (GH-600 style)

- Work is tracked via issues (feature / bug / AI agent task templates); branches per
  issue; small, focused PRs using the PR template; CI must pass before merge.
- Branch protection on `main`: PRs required, CODEOWNERS review required, and the CI
  checks (lint, typecheck, test, build) required before merge. See
  `.github/BRANCH_PROTECTION.md`.
- More specific conventions live in `.github/instructions/`:
  `react.instructions.md`, `power-platform.instructions.md`, `testing.instructions.md`.
