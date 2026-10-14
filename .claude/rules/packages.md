---
paths:
  - "packages/**"
---

# `packages/` standards

## `@zotmeet/shared`

- No `react`, `zustand`, DOM, `next/*`, `@/db`, `expo-*`, `react-native`, `node:*`. Dependencies are `date-fns`, `date-fns-tz`, `zod` only, and Biome blocks any other import (tests may also use `node:test` and `node:assert`); adding another is a team decision, not a PR side effect.
- Types are **structural** (`Pick<...>` of the fields read), never Drizzle row types. Where web has a Drizzle-derived twin, pin them together with a typecheck assertion (pattern: `src/lib/types/availability.ts:26-31`).
- Every export must behave identically on Node, browser and Hermes: no `Intl` features Hermes lacks, no `AbortSignal.any`, no `crypto.subtle`.
- When you move logic here, the old web module re-exports it so web imports don't change.
- A change here needs all three typechecks (shared, web, mobile).

## `@zotmeet/tokens`

Owns, for both apps: colour tokens (`index.js`), Tailwind colour/radius wiring (`tailwind.js`), the type ramp (`typography.js` → `muiTypography()` for `src/theme.ts`, `tailwindFontSize()` for the Expo config), and the brand hex used by the manifest, icon script and `app.config.ts` (`brand`). Change these values here or nowhere — and only with sign-off, since Figma is the source of truth.
