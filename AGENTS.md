# ZotMeet — instructions for coding agents and reviewers

Read by Claude Code (through `CLAUDE.md`), Cubic and other AI tools. Rules that apply to
only one part of the repo live in `.claude/rules/` (web, mobile, packages, React) and load
when those files are touched. Rationale and diagrams live in `apps/mobile/README.md`;
update it when a rule below changes.

## Repo shape

pnpm workspace (`apps/*`, `packages/*`):

| Package | Path | What lives here | Runtime |
|---|---|---|---|
| web (root) | `src/` | Next.js 16 (App Router, RSC, server actions), Drizzle, the `/api/*` routes mobile calls, PWA | Node + browser |
| `@zotmeet/mobile` | `apps/mobile/` | Expo SDK 57 / RN 0.86, Expo Router, NativeWind | Hermes |
| `@zotmeet/shared` | `packages/shared/` | **Pure** TS: time maths, grid logic, meetings helpers, zod schemas, API wire types, OAuth contract | Any |
| `@zotmeet/tokens` | `packages/tokens/` | Colour tokens, Tailwind colour/radius wiring, type ramp, brand hex — plain CommonJS | Any |

- Mobile never imports from `src/`. Web never imports from `apps/mobile/`.
- Mobile has no backend. It calls `src/app/api/**/route.ts`, which wrap existing `@actions/*` / `@data/*` functions.
- The mobile web UI is being phased out in favour of Expo. The desktop web UI and the Next.js **server** (API routes, auth callbacks, invite/SEO pages) stay. Don't delete server code because "mobile doesn't use it".

## Stack (both apps)

- React 19.2.3, zod 3, zustand 5, Tailwind 3.4 syntax, `clsx` + `tailwind-merge` via `cn()`, Biome for lint/format.
- Conventional commits with devmoji (`feat: ✨ …`, `fix: 🐛 …`).
- Tests live in `packages/shared` only (pure, no DOM), on Node's built-in runner via `tsx`: `pnpm --filter @zotmeet/shared test` runs `src/*/*.test.ts`, and CI runs it too. Don't add a second runner.

## Where new code goes

Apply in order; stop at the first match.

1. **Touches the DB, `next/*`, `server-only`, SES, `googleapis`, cookies, or secret env vars** → web. Server actions and queries under `src/server/` (`actions/<entity>/<verb>/action.ts`, `data/<entity>/queries.ts`); other server-coupled helpers under `src/lib/`. If mobile needs it, expose it (see below).
2. **A colour, radius or type size** → `packages/tokens`. Never a hex/HSL/px literal in a component, theme or Tailwind config.
3. **Pure logic both apps could need** (date/time, grid maths, sorting/filtering, formatting, validation, wire types, constants) → `packages/shared/src/<domain>/`. Mobile imports `@zotmeet/shared`; web keeps its old import path by **re-exporting** from the old module. For a React hook, only the pure function moves; each app keeps its own `useMemo`/`useCallback` wrapper.
4. **Everything else is platform-specific** → the owning app, at the **same folder and file name** as its counterpart (`components/availability/table/availability-block.tsx` exists in both), with a header comment naming the counterpart and how it deviates.

**Same-named files that are intentionally separate — do not merge or "deduplicate":** `lib/utils.ts`, `lib/auth/*`, `lib/meetings/delete-leave-action.ts`, `nativeRedirectUriOptions`, and every `components/**` pair. Two more are separate pending a design call: the personal-edit lifecycle (web `hooks/use-edit-state.ts` + `use-availability-action-handlers.ts` vs mobile's inline snapshot) and month-grid maths (`ZotDate.generateZotDates` vs mobile `lib/date.ts#getMonthGrid`).

## Exposing something to mobile

1. Find the existing `@actions`/`@data` function. If it's cookie-coupled, split it into `xForMember(data, memberId)` + the thin action (pattern: `createMeetingFromData`, `archiveMeetingForMember`).
2. Add `src/app/api/<path>/route.ts`: `getMemberIdFromBearer` → parse the body with the shared zod schema → call the function → JSON, built with `satisfies <ResponseType>`.
3. Request/response types and schema go in `packages/shared/src/<domain>/schema.ts`.
4. Client function goes in `apps/mobile/src/lib/api/<domain>.ts`.
5. Never reimplement server logic in the route or on the device.

## Commands

```bash
pnpm dev                                   # web + /api on :3000 (Postgres on :5434 via docker)
pnpm mobile                                # Expo dev server (needs pnpm dev running)
pnpm check                                 # Biome lint + format, whole repo
pnpm --filter @zotmeet/shared typecheck    # TS 5.9
pnpm --filter @zotmeet/shared test         # Node test runner
npx tsc --noEmit                           # web, TS 5.9 (root tsconfig excludes apps/)
pnpm --filter @zotmeet/mobile typecheck    # TS 6.0
pnpm db:setup | db:migrate | db:generate | db:seed
```

The `PR checks` workflow runs Biome, all three typechecks and the shared tests on every PR. Run the ones for the
packages you touched before pushing; a change under `packages/**` needs all three.

## Gotchas

- TypeScript is 5.9 on web/shared and 6.0 on mobile. Shared code must satisfy both.
- `pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` — a version released today won't install; pin one patch back.
- `next.config.mjs` `transpilePackages` must list any new workspace package the web consumes.
- `EXPO_PUBLIC_*` vars are inlined at bundle time; restart Expo after changing them.
- Storage: `fromTime`/`toTime` are UTC `"HH:MM:SS"`; `dates` are ISO local-midnight instants; "days of week" meetings store `ANCHOR_DATES`. Use `convertTimeToUTC` / `convertTimeFromUTC` / `localMidnightFromIsoDate` from shared — never `new Date(iso)` for a day column.
- Biome ignores `src/components/ui/**` and `tailwind.config.ts` but **not** their mobile equivalents.
- `ios/` is the PWABuilder Swift wrapper, not Expo. `apps/mobile/app.config.ts` reuses its bundle id `com.zotmeet` — resolve before any EAS store build.

## Don't, without asking a maintainer

- Add a dependency to `@zotmeet/shared`, or React/zustand anywhere in `packages/`.
- Add a data-fetching library, form library, or second component library to either app.
- Move code between web and mobile, or merge the intentionally separate pairs above.
- Change colour values in `packages/tokens` (Figma is the source of truth) or the MUI palette in `src/theme.ts`.
- Delete web features mobile lacks (groups, notifications, study rooms, Google Calendar import, Apple sign-in, guest availability).
- Commit or push.
