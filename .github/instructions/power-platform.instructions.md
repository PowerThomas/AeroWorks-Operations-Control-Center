---
applyTo: "**"
---

# Power Apps Code Apps / Dataverse conventions

## Scaffold and tooling

- The app is scaffolded from the official Microsoft PowerAppsCodeApps **`starter`**
  template (`microsoft/PowerAppsCodeApps/templates/starter`), not plain Vite. Preserve the
  Code Apps essentials it ships: the `@microsoft/power-apps` SDK, the
  `@microsoft/power-apps-vite` Vite plugin, `power.config.json`, and the template's
  `vite.config.ts` and port/host conventions.
- Tooling is **npm-based Code Apps CLI first**: prefer `power-apps` CLI commands
  (`login`, `auth-status`, `auth-switch`, `init`, run/push) where supported. Use
  `pac code` / `pac auth` only where current Microsoft docs still require it (notably
  data-source generation and connection-reference operations). Re-check
  aka.ms/pacodeapps before Phase 2 work.

## Phase boundaries

- **Phases 0–1**: local only. Never run `power-apps init/push`, `pac auth`, `pac code`,
  connector setup, environment selection, Dataverse setup, or any deployment command.
  No Power Platform credentials in CI.
- **Phase 3**: Dataverse tables are created solution-aware in a dev environment; typed
  models/services are generated into the CLI's output paths.
- **Phase 4**: first non-Dataverse connectors bring the first connection references.
- **Phase 5**: solution-aware ALM, environment variables, Power Platform Pipelines.
  GitHub remains the source of truth for the React/TypeScript source code.

## Generated code rules

- Generated output lives wherever the current Code Apps CLI generates it:
  Dataverse under `src/generated/…`; Power Automate flows under `src/services`,
  `src/models`, and `schemas/logicflows`; other connectors may differ.
- **Never manually edit generated files** — they are overwritten on regeneration.
- **Never import generated services directly** from handwritten feature code. Wrap them
  behind the repository/adapter interfaces in each feature's `data/` folder
  (e.g., `DataverseAssetRepository` implementing `AssetRepository`).
- If a generated output path falls outside `src/generated`, document it as generated and
  apply the same no-manual-edit rule.

## Data model direction

- The future Dataverse model uses the `aw_` prefix: `aw_asset`, `aw_operationalzone`,
  `aw_inspection`, `aw_incident`, `aw_workorder`, `aw_exceptionrequest`, `aw_auditnote`,
  `aw_setting`. Mock domain types (Phase 1) must be intentionally shaped toward this
  model — async list/get/create/update call patterns, id-based lookups, paging-friendly
  signatures — so the mock → Dataverse swap is a data-layer change, not a domain rewrite.
- Evidence files belong in **SharePoint** (Phase 4), linked from inspections, incidents,
  and exception requests — not Dataverse file columns.
- Azure SQL may only be adopted with a written justification of why Dataverse is
  insufficient.
