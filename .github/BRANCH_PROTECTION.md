# Branch protection & merge policy

This document records the branch protection and CI-required-before-merge policy for this
repository (Phase 0 guardrail). Branch protection itself is configured in GitHub
repository settings (**Settings → Branches → Branch protection rules**, or a ruleset);
this file is the source-of-truth description of what must be enabled.

## Protected branch: `main`

| Setting | Value |
|---|---|
| Require a pull request before merging | ✅ Enabled — no direct pushes to `main` |
| Required approvals | ✅ At least 1 |
| Require review from Code Owners | ✅ Enabled (see `.github/CODEOWNERS`) |
| Dismiss stale approvals when new commits are pushed | ✅ Enabled |
| Require status checks to pass before merging | ✅ Enabled |
| Required status checks | `lint`, `typecheck`, `test`, `build` (from `.github/workflows/ci.yml`, added in Phase 1) |
| Require branches to be up to date before merging | ✅ Enabled |
| Require conversation resolution before merging | ✅ Enabled |
| Allow force pushes / deletions | ❌ Disabled |

> **Note:** The required status checks can only be selected in GitHub settings once the
> CI workflow exists and has run at least once. Enable the PR/review rules immediately in
> Phase 0; add the four required checks as soon as the Phase 1 `ci.yml` lands.

## Workflow policy (GH-600 style)

1. Every change starts from an **issue** (feature, bug, or AI agent task template).
2. Create a branch per issue; keep changes small and focused.
3. Open a PR using the PR template, linking the issue (`Closes #…`).
4. CI must pass (`lint`, `typecheck`, `test`, `build`) and a CODEOWNERS review must be
   approved before merge.
5. Merge via the PR only — never push directly to `main`.

## CI credentials policy

- **Phases 0–1:** no Power Platform credentials of any kind in CI.
- **Phase 2+:** any credentials required for Power Platform operations are introduced
  deliberately by the repository owner, scoped via GitHub environments/secrets, and never
  committed to the repository.
