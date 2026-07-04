---
applyTo: "**/*.{ts,tsx}"
---

# Testing strategy and expectations

## Stack

- **Vitest** is the test runner; **Testing Library** (`@testing-library/react`,
  `@testing-library/jest-dom`) with `jsdom` for component tests. These are dev
  dependencies added on top of the starter template (which ships no test runner).
- `npm run test` runs a single pass (used in CI); `npm run test:watch` for local
  development.

## What to test (priority order)

1. **Domain logic** — pure functions in each feature's `domain/` folder (e.g.,
   `computeAssetHealthStatus`, `isInspectionOverdue`, `prioritizeTriageExceptions`).
   Every non-trivial domain function gets a `*.test.ts` next to it covering normal cases,
   boundaries, and edge cases.
2. **Repository behavior** — mock repositories return correctly typed data, resolve
   asynchronously, and honor id-based lookups (including the not-found case).
3. **Component tests** — only for routing/layout/state behavior that can fail
   meaningfully: loading, empty, error, populated, and not-found states. Do not write
   snapshot tests or tests that merely re-assert static markup.

## Conventions

- Co-locate tests with the code under test (`domain/asset.test.ts` next to
  `domain/asset.ts`).
- Test behavior through public interfaces; do not reach into implementation details.
- Component tests interact via accessible queries (roles, labels, text) rather than test
  ids where practical.
- Tests must be deterministic: no real timers without `vi.useFakeTimers()`, no network,
  no reliance on system time — inject dates/clocks into domain functions.
- Never import from `src/generated` (or other generated output paths) in tests; test the
  repository interfaces and adapters instead.

## CI

- CI (`.github/workflows/ci.yml`, added in Phase 1) runs `lint`, `typecheck`, `test`, and
  `build` as separate steps on PRs and pushes to `main`. All must pass before merge.
- Phase 5 adds Playwright E2E tests against a deployed environment; keep unit/component
  tests fast and independent of any environment.
