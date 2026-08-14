# Fueguito

Party game web app — spicy pass-the-phone games for gatherings.

Mobile-first React SPA. No backend, runs locally in the browser.

## Stack

React 19 · TypeScript (strict) · Vite · Vitest + Testing Library · oxlint

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script             | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Dev server                   |
| `npm run build`    | Typecheck + production build |
| `npm run test`     | Tests in watch mode          |
| `npm run test:run` | Tests, single run            |
| `npm run lint`     | Lint with oxlint             |

## Architecture

Clean Architecture — dependencies point inward. See [AGENTS.md](./AGENTS.md) for
layer rules and conventions.
