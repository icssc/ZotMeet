# `@zotmeet/shared`: pure logic for both apps

Repo-wide rules are in [../../AGENTS.md](../../AGENTS.md).

## What belongs here

Code that **both apps could use** and that **touches nothing platform-specific**: time maths, `ZotDate`, availability grid/paint/fill logic, meeting helpers, zod schemas, API request/response types, and the OAuth contract.

Folders are by domain: `auth/`, `availability/`, `chrono/`, `meetings/`, `library-traffic/`. Export everything through `src/index.ts`.

## Rules

- **Dependencies:** `date-fns`, `date-fns-tz` and `zod` only. Adding one is a team decision. Biome blocks React, React Native, zustand, `next/*`, `server-only`, Drizzle, `expo-*`, MUI and `@/` imports.
- **Types are structural.** Use a `Pick<…>` of the fields you read, never a Drizzle row type. When web has a Drizzle-derived twin, pin the two together with a type assertion (pattern: `src/lib/types/availability.ts`).
- **Must run the same on Node, browser and Hermes.** That rules out `Intl` features Hermes lacks, `AbortSignal.any` and `crypto.subtle`.
- **TypeScript 5.9 and 6.0** must both accept it.
- **Web consumers re-export** from their old module path (e.g. `src/lib/types/chrono.ts`). Mobile imports `@zotmeet/shared` directly.
- **Hooks:** only the pure function lives here. Each app wraps it.

## Tests

Use `node:test`, in `*.test.ts` files next to the source (see `meetings/card.test.ts`). Run `pnpm --filter @zotmeet/shared test`.

## Before you finish

Run all three typechecks (web, mobile, shared) plus the tests. A change here can break either app.
