# ZotMeet: contributor & agent guide

ZotMeet is UC Irvine's Time-Sync & Room Booking app

| Part | Path | What it is |
|---|---|---|
| Web | `src/` | Next.js app. **contains shared backend across web and mobile**: server actions, queries and the `/api` routes mobile calls. |
| Mobile | `apps/mobile/` | Expo app that replaces the mobile web UI. It has **no backend of its own**. |
| Shared logic | `packages/shared/` | Pure TypeScript both apps import (`@zotmeet/shared`). |
| Design tokens | `packages/tokens/` | Colours, radii and type ramp both apps import (`@zotmeet/tokens`). |

Also read the guide for the area you're working in:

| Working in | Read |
|---|---|
| `src/` | [src/AGENTS.md](src/AGENTS.md) |
| `apps/mobile/` | [apps/mobile/AGENTS.md](apps/mobile/AGENTS.md) (full background in its [README](apps/mobile/README.md)) |
| `packages/shared/` | [packages/shared/AGENTS.md](packages/shared/AGENTS.md) |
| `packages/tokens/` | [packages/tokens/AGENTS.md](packages/tokens/AGENTS.md) |
| Any UI | [docs/design-system.md](docs/design-system.md) |

---

## Tech stack

| | Web (`src/`) | Mobile (`apps/mobile/`) |
|---|---|---|
| Framework | Next.js 16 (App Router, server components) | Expo SDK 57, React Native 0.86 |
| React | 19.2 | 19.2 |
| Components | **MUI 7** | **Custom `components/ui/*`**, a copy of MUI's API (see [design system](docs/design-system.md)) |
| Styling | Tailwind 3.4 + MUI theme | NativeWind 4 (Tailwind 3.4 syntax) |
| Icons | `@mui/icons-material` | Material Icons via `<Icon name="…" />` |
| Routing | App Router | Expo Router (same paths as web) |
| Data | Server components + server actions | `apiFetch` → `/api/*` routes |
| Client state | zustand 5, `nuqs` (URL state) | zustand 5 |
| Animation | CSS / MUI transitions | Reanimated 4, Gesture Handler, Haptics |
| Auth | Session cookie | Bearer token in `expo-secure-store` |

**Shared by both:** TypeScript, zod 3, date-fns, `cn()` (clsx + tailwind-merge), Biome.
**Backend:** Postgres + Drizzle, Arctic (ICSSC/Google OAuth), AWS SES, deployed with SST. PostHog for analytics.

---

## Where should this code go?

Check the rows in order and use the first one that matches.

| If the code… | It goes in | Example |
|---|---|---|
| **1.** touches the DB, cookies, secrets, SES, `googleapis` or `next/*` | `src/server/data/<entity>/` (logic and queries) and `src/server/actions/<entity>/<verb>/action.ts` (web mutations). Auth and email helpers go in `src/lib/`. | `src/server/data/meeting/member-actions.ts` |
| **2.** is a colour, radius or font size | `packages/tokens` | `packages/tokens/index.js` |
| **3.** is pure logic either app could use (dates, grid maths, sorting, formatting, zod schemas, API types) | `packages/shared/src/<domain>/` | `packages/shared/src/chrono/time.ts` |
| **4.** is UI, gestures, navigation or storage | The app that owns it, **at the same path as its twin** in the other app | `components/availability/table/availability-block.tsx` exists in both |

Follow-up rules:

- **Shared code:** mobile imports `@zotmeet/shared`. Web keeps its old import path, which re-exports from shared, so don't rewrite web imports.
- **React hooks:** only the pure function moves to shared. Each app keeps its own `useMemo`/`useCallback` wrapper.
- **Platform twins:** start the file with a comment naming its counterpart and what's different.
- **Twins that are separate on purpose (don't merge):** `lib/utils.ts`, `lib/auth/*`, `lib/meetings/delete-leave-action.ts`, `nativeRedirectUriOptions`, and every `components/**` pair. The edit lifecycle (`use-edit-state.ts` vs mobile's snapshot) and month-grid maths (`ZotDate` vs mobile `lib/date.ts`) need a design call before anyone shares them.

---

## Shared backend across Mobile & Web apps

```
web page / client component ──▶ server action ──────────┐
                                                        ├──▶ src/server/data/* ──▶ Postgres
mobile ──▶ lib/api/* ──▶ src/app/api/**/route.ts ───────┘
```

Every business rule has **one** implementation, in `src/server/`. Web reaches it through a server component or server action. Mobile reaches the **same function** through a thin `/api` route.

**To expose something to mobile:**

1. Find the function in `src/server/`. If it reads the cookie session, split it: put the logic in `xForMember(data, memberId)`, then call that from both the action and the route (e.g. `archiveMeetingForMember`).
2. Add `src/app/api/<path>/route.ts`: `getMemberIdFromBearer` → validate with the shared zod schema → call the function → `NextResponse.json<ResponseType>(…)`. Copy `src/app/api/meetings/[id]/archive/route.ts`.
3. Put the request/response types and schema in `packages/shared/src/<domain>/schema.ts`.
4. Add the client function in `apps/mobile/src/lib/api/<domain>.ts`.

**Never** put business logic in a route, in the body of a server action, or on the device. **Never** delete server code because "mobile doesn't use it". The web UI is being phased out, but the server stays (API, auth callbacks, invite/SEO pages).

---

## React practices (both apps)

These are the rules we actually enforce, not a general React tutorial.

- **Derive, don't sync.** Compute values from props and state during render (or in `useMemo`). Don't write a `useEffect` that sets state from other state.
- **Keep logic out of components.** Put pure logic in `packages/shared` or `lib/`, so components stay presentational and the logic works in both apps.
- **zustand stores** (`store/useXStore.ts`) hold client state that several components share. Read them with a selector, `useXStore((s) => s.x)`, not by destructuring the whole store.
- **Validate at the boundary** with the shared zod schema (form submit, API route, API client), then trust the types inside.
- **Use the stack you have.** No new data-fetching, form, animation or component library (see "Ask first" below).

## Conventions

- **Files:** kebab-case filenames, `PascalCase` component exports, stores named `useXStore.ts`, hooks named `use-x.ts`.
- **Commits:** conventional commits with devmoji, e.g. `feat: ✨ …` or `fix: 🐛 …`.
- **Comments:** explain *why*. Platform twins name their counterpart.
- **Tests:** `node:test` in `packages/shared`, as `*.test.ts` next to the source. Don't add a second test runner.

## Storage conventions (both apps)

- `fromTime`/`toTime` are stored as UTC `"HH:MM:SS"`. Convert with `convertTimeToUTC` / `convertTimeFromUTC`.
- `dates` are ISO local-midnight instants. "Days of week" meetings store `ANCHOR_DATES`.
- Render a day column with `localMidnightFromIsoDate(iso)`, **never** `new Date(iso)`.

---

## Before you finish

Setup and database commands are in the [README](README.md). CI does **not** typecheck, so run these yourself:

| You touched | Run |
|---|---|
| Anything | `pnpm check` (Biome) |
| `src/` | `npx tsc --noEmit` |
| `apps/mobile/` | `pnpm --filter @zotmeet/mobile typecheck` |
| `packages/` | All three typechecks (web, mobile, `pnpm --filter @zotmeet/shared typecheck`) + `pnpm --filter @zotmeet/shared test` |

## Ask first

- Committing or pushing.
- Adding a dependency to `packages/shared`, or React/zustand anywhere in `packages/`.
- Adding a data-fetching, form, animation or component library to either app (web data goes through server components/actions; forms use plain `useState`).
- Moving code between web and mobile, or merging the intentional twins above. Mobile never imports from web `src/`, and web never imports from `apps/mobile/`.
- Changing token values in `packages/tokens` (Figma is the source of truth) or the MUI palette in `src/theme.ts`.
- Deleting web features mobile doesn't have yet (groups, notifications, study rooms, Google Calendar import, Apple sign-in, guest availability).
