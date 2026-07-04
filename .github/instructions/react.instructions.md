---
applyTo: "**/*.{ts,tsx}"
---

# React / TypeScript conventions

## TypeScript

- Strict mode always: `"strict": true`, `noUnusedLocals`, `noUnusedParameters`,
  `noImplicitReturns`. Do not weaken compiler options.
- No `any`. Prefer precise types, discriminated unions for state (e.g., loading/empty/
  error/populated), and `unknown` + narrowing at boundaries.
- Export types alongside the code they describe; cross-feature shared types go in
  `src/shared/types/`.
- Prefer `interface` for object shapes that may be implemented/extended (e.g., repository
  interfaces) and `type` for unions, intersections, and utility compositions.
- Use named exports; avoid default exports except where a framework requires them.

## React

- Function components only, typed with explicit prop interfaces. No class components.
- Feature pages live in `src/features/<feature>/ui/`; app-level layout and routing live in
  `src/app/`.
- Components must not fetch data directly: data access goes through the feature's
  TanStack Query hooks (`hooks/`), which call the repository interface (`data/`).
- Keep components presentational where possible; put business logic in `domain/` so it is
  unit-testable without rendering.
- Use the shared `LoadingState`, `ErrorState`, and `EmptyState` components from
  `src/shared/components/` for those UI states — do not reinvent them per feature.
- Routing via React Router: routes are declared centrally in `src/app/router.tsx`, with a
  `*` catch-all rendering `features/notFound/ui/NotFoundPage`.

## TanStack Query

- One hooks module per feature (`useAssets`, `useAsset(id)`, …); query keys are
  namespaced per feature (e.g., `["assets"]`, `["assets", id]`).
- Hooks receive the repository via a simple factory or React context — never instantiate
  a concrete repository inside UI components.
- `QueryProvider` in `src/app/providers/` is the single `QueryClientProvider` wrapper.

## General

- Small, focused modules; avoid barrel files that hide layer boundaries.
- No direct imports from `src/generated` (or other generated output paths) anywhere in
  feature or shared code.
- Follow the ESLint flat config from the starter template; fix lint findings rather than
  disabling rules.
