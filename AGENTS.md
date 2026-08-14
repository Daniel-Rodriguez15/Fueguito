# Fueguito — Agent Guide

Fueguito is a party game web app (spicy/party games for gatherings, pass-the-phone style).
Mobile-first React SPA. No backend, no app store — runs locally in the browser.

## Stack

- React 19 + TypeScript (strict) + Vite
- Vitest + Testing Library (jsdom)
- oxlint for linting
- No state-management or UI libraries unless a real need is demonstrated first

## Commands

```bash
npm run dev       # dev server
npm run build     # typecheck + production build
npm run test      # vitest watch mode
npm run test:run  # vitest single run (use in CI / verification)
npm run lint      # oxlint
```

## Architecture (Clean Architecture)

Dependency rule: source code dependencies point INWARD only.

```
src/
  domain/          # Entities, value objects, domain errors, repository ports (interfaces).
                   # Pure TypeScript. NO imports from other layers, NO React, NO browser APIs.
  application/     # Use cases orchestrating domain logic. Depends on domain only.
                   # Receives ports via constructor/factory injection.
  infrastructure/  # Adapters implementing domain ports (localStorage, JSON data sources).
                   # Depends on domain (ports) only.
  ui/              # React components, pages, hooks. Depends on application + domain.
                   # Wires infrastructure adapters into use cases at the composition root.
  test/            # Shared test setup.
  main.tsx         # App entry point / composition root.
```

Layer rules:

- `domain` imports nothing from `application`, `infrastructure`, or `ui`. Ever.
- `application` imports only from `domain`.
- `infrastructure` imports only from `domain` (implements its ports).
- `ui` may import from `application` and `domain`; it must not import `infrastructure`
  directly except at the composition root (`main.tsx` or a dedicated `ui/composition/` module).
- Game content (questions, challenges, decks) is data, not code: model it in `domain`,
  load it through a repository port implemented in `infrastructure`.

## Conventions

- Path alias: import from `@/` (maps to `src/`). No deep relative imports (`../../..`).
- Components: function components only, one component per file, named like the file (PascalCase).
- Hooks: `useThing.ts` in `ui/hooks/`. Custom hooks contain UI state logic only —
  business rules live in `application`/`domain`.
- Container/presentational split: pages (containers) call use cases; presentational
  components receive data via props and stay logic-free.
- Naming: PascalCase for components/types, camelCase for functions/variables,
  kebab-case is not used in filenames for components.
- All UI copy, code, comments, and identifiers in English.
- No `any`. No `@ts-ignore`. Model absence with `null`/discriminated unions.
- Small functions, single responsibility, no dead code, no commented-out code.

## Testing

- Every use case and domain entity gets a unit test (pure, no DOM needed).
- Components: test behavior via Testing Library (`getByRole` queries preferred), not implementation details.
- Test files live next to the code they test: `Thing.test.ts(x)`.
- Run `npm run test:run` and `npm run build` before considering any change done.

## Git

- Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`).
- No AI attribution in commits.
