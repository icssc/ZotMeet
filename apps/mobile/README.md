# ZotMeet Mobile — Developer Guide

`apps/mobile` is the React Native (Expo) client. It is built to be a **mirror of the web app**: same file structure, same component names, same helper functions, same backend. If you know where something lives on web, it lives in the same place here. This guide explains that structure and the rules that keep the two apps consistent.

## Quick start

```bash
pnpm dev      # terminal 1 — web app + /api routes on :3000 (Postgres via docker on :5434)
pnpm mobile   # terminal 2 — Expo dev server; press i (iOS sim), a (Android), w (web preview)
```

Both must be running: the mobile app talks to the database only through the web app's `/api` routes.

Env files (copy from the `.env.example` next to each):

| File | Vars | Notes |
|---|---|---|
| root `.env` | `MOBILE_DEV_API_TOKEN`, `MOBILE_DEV_HOST_MEMBER_ID` | Dev-only auth for the API. Member id `00000000-0000-0000-0000-000000000000` is "Seed Admin" from `pnpm db:seed`. |
| `apps/mobile/.env.local` | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_API_TOKEN` | Token must equal the root one. Use your Mac's LAN IP instead of `localhost` on a physical device. |

`EXPO_PUBLIC_*` values are inlined into the JS bundle at build time — restart Expo after changing them, and never put the token in `eas.json` or `app.config.ts`.

---

## 1. Repo layout

```
/                      Next.js web app (unchanged in role — production + PWA)
├── src/               web source
├── apps/mobile/       Expo app (this guide)
│   └── src/
│       ├── app/           expo-router routes — same paths as web (see §3)
│       ├── components/    same folder names as web src/components (see §3)
│       ├── lib/           icons, theme, date maths, API client
│       ├── hooks/         data hooks (useMeeting)
│       └── store/         zustand stores, same names as web src/store
├── packages/tokens/   colours — one source for both apps (see §2)
└── packages/shared/   domain helpers + API contract — one source for both apps (see §4)
```

Web and mobile typecheck independently (root `tsconfig.json` excludes `apps/`). Mobile never imports from web `src/`; anything both need goes in `packages/`.

---

## 2. Design system: same look, different renderer

The Figma wireframes are drawn in MUI. MUI doesn't run in React Native, so the mobile app rebuilds the needed pieces on RN primitives **while keeping MUI's names and props** — a snippet from the web or a Figma spec should transfer verbatim.

### Colours — `packages/tokens`

Every colour is defined once in `packages/tokens/index.js`. Both Tailwind configs (web `tailwind.config.ts`, mobile `tailwind.config.js`) emit them as CSS variables, so `bg-primary`, `text-muted-foreground`, `border-border` mean the same thing on both platforms.

- **Rule:** never write a hex/HSL literal in a component. Add a token instead.
- MUI's translucent inks (e.g. `rgba(0,0,0,.54)` for `action.active`) are stored pre-composited (`action-active`, `text-disabled`, `input-outlined`, `elevation-3d`, `primary-tint`, `primary-ledge`) because RN can't blend.
- Need a raw colour for an RN prop (`placeholderTextColor`, navigator tints)? Use `colorsFor(colorScheme)` from `lib/theme.ts` — it reads the same tokens.

### Utility classes — NativeWind

`apps/mobile/tailwind.config.js` mirrors the web config. Two things differ from web Tailwind:

- **Type ramp:** MUI's variants are `fontSize` entries named after the Figma text styles — `text-h6`, `text-body2`, `text-caption`, `text-button-md`. A spec that says "typography/h6" → `text-h6`.
- **Fonts:** RN can't synthesise weights, so each Figtree weight is its own family: `font-figtree`, `font-figtree-medium`, `font-figtree-semibold`, `font-figtree-bold`, `font-figtree-italic`. `font-medium` / `font-bold` do **nothing** here.
- **Rule:** when adding a `fontSize` or `borderRadius` key to the config, add it to the matching list in `lib/utils.ts` too — `tailwind-merge` otherwise treats an unknown `text-*` as a colour and drops it.

### Components — `src/components/ui/`

| Component | Web / MUI counterpart | Notes |
|---|---|---|
| `Button` | MUI `<Button>` | `variant="contained\|outlined\|text"`, `color`, `size="small\|medium\|large\|square"`. `label` prop saves the `<Text>` wrapper. |
| `IconButton` | MUI `<IconButton>` | Same variants; hands the icon child its size and colour. |
| `Typography` | MUI `<Typography>` | Same `variant` / `color` / `align` / `noWrap`; `color` accepts both `text.secondary` and `textSecondary`. |
| `Text` | base primitive | Defaults to Figtree Regular + `text-foreground`. Reach for `Typography` unless you want no style. |
| `Raised` | the theme's 3D ledge | Web draws a blur-less box-shadow; RN can't, so the ledge is a real view and pressing sinks the face. Used by `Button`, `IconButton`, `SelectableCard`. |
| `Input`, `TimeField` | MUI outlined `<TextField>` / `<TimePicker>` | Share `FieldShell` so every field-shaped thing has identical border geometry. |
| `Tabs` | radix tabs (`segmented`) / MUI `<Tabs>` (`underline`) | Wireframes use `underline`. |
| `Calendar`, `DayCell` | web `creation/calendar/*` | Drag-to-select with the same range semantics. |
| `Dialog`, `Card`, `FormLabel`, `FormHelperText`, `SelectableCard`, `SheetGrabber`, `Screen` | radix / MUI / wireframe equivalents | See each file's doc comment. |

- **Rule:** before building a component, check this folder and the web's `src/components/ui`. Match the MUI prop vocabulary; document the web counterpart in the doc comment.

### Icons — `lib/icons.tsx`

All icons are **lucide** via `<Icon.Name />` (e.g. `<Icon.ChevronLeft size={20} className="text-action-active" />`). Material icons from Figma are substituted with the closest lucide glyph — don't export SVGs from Figma. The wrapper makes `text-*` classes colour the stroke and defaults to `text-foreground` so icons survive dark mode.

### Dark mode

`userInterfaceStyle: "automatic"`; NativeWind's `useColorScheme()` flips the token set. Using tokens (not literals) is what makes a component dark-mode-safe for free.

---

## 3. Screens & file structure: mirror the web

Routes use the same paths as web, and component folders use the same names. When you build a mobile screen, start by opening the web version and copy its decomposition.

| Web | Mobile | Status |
|---|---|---|
| `app/(creation)/page.tsx` → `components/creation/` | `app/create-meeting.tsx` → `components/meetings/create-meeting.tsx` | ✅ modal sheet |
| `app/availability/[slug]/page.tsx` | `app/availability/[slug].tsx` | ✅ loading / not-found / error inline |
| `components/availability/availability.tsx` | same | ✅ |
| `components/availability/header/availability-header.tsx` | same | ✅ |
| `components/availability/group-availability.tsx` | same | ✅ presentational |
| `components/availability/table/{table-header, nav-button, time-ticks, block}.tsx` | same, + `availability-table-metrics.ts` | ✅ hour-granular, no painting yet |
| `components/availability/availability-actions.tsx` | same | ✅ no handlers yet |
| `components/mobile/mobile-island.tsx` | same | ✅ |
| `store/useAvailabilityStore.ts` | same (pagination slice only) | ✅ |
| `app/summary` (meetings list) | `app/(tabs)/index.tsx` → `components/meetings/meetings-home.tsx` | empty state only |

Where a mobile file must deviate (e.g. web renders a `<table>`, mobile uses flex columns), the doc comment at the top of the file says what differs and why.

- **Rule:** same name, same responsibility, documented deviation. Don't invent a new folder when the web already has one.

---

## 4. Shared logic: `packages/shared` (`@zotmeet/shared`)

Anything both apps need that is **pure** (no DOM, no `next/*`, no DB) lives here.

```
packages/shared/src/
├── chrono/types.ts     HourMinuteString, ANCHOR_DATES, Weekday, isAnchorDateMeeting, …
├── chrono/time.ts      convertTimeToUTC, convertTimeFromUTC, sortMeetingIsoDatesAsc,
│                       formatTimeWithHoursAndMins, formatDateToUSNumeric, localMidnightFromIsoDate, …
└── meetings/schema.ts  createMeetingSchema (zod), CreateMeetingInput, MeetingResponse, ApiErrorResponse
```

- The web files that used to own these (`src/lib/types/chrono.ts`, `src/lib/availability/utils.ts`) now **re-export** them, so web imports didn't change. Mobile imports `@zotmeet/shared` directly.
- The web `createMeeting` server action and the `POST /api/meetings` route both validate with `createMeetingSchema` — one set of rules.
- `MeetingResponse` is the API's wire shape. The GET route builds its body with `satisfies MeetingResponse`, so a DB column change fails the **web** typecheck instead of silently breaking mobile.
- **Not shared, on purpose:** `ZotDate` and the 15-minute slot/painting logic stay in web `src/lib/`. They're coupled to the DOM and the web store. Lifting them here is the next step when mobile paints availability.

**Storage conventions both apps must follow:**

- `fromTime` / `toTime` are UTC wall-clock `"HH:MM:SS"`; `timezone` records the zone they were entered in. Write with `convertTimeToUTC(local, tz, dates[0])`; read with `convertTimeFromUTC`.
- `dates` are ISO instants of local midnight (`new Date(y, m, d).toISOString()`). "Days of the week" meetings store `ANCHOR_DATES` (2023-01-01…07) instead of real dates and have `meetingType: "days"`.
- Render a day column with `localMidnightFromIsoDate(iso)`, never `new Date(iso)` — anchor dates must show as Sun–Sat in every timezone.

- **Rule:** if you write a date/time helper in mobile, it almost certainly belongs in `packages/shared` with a web re-export, not in `apps/mobile/src/lib/date.ts` (that file is only for the native calendar picker's grid maths).

---

## 5. Backend: mobile calls the web app's API

The web app has no separate backend — server actions and server components call Drizzle directly. Mobile can't use those, so it calls thin HTTP routes that wrap **the same functions**:

| Route | Wraps | Auth |
|---|---|---|
| `POST /api/meetings` | `createMeetingFromData` (`src/server/actions/meeting/create/action.ts`) | bearer required → 201 `{ id }` |
| `GET /api/meetings/[id]` | `getExistingMeeting` + responder counts (`src/server/data/meeting/queries.ts`) | public, like the web page |

**Auth** (`src/lib/auth/bearer.ts`): mobile sends `Authorization: Bearer <token>`. Today a **dev token** maps to the seeded member; the helper falls through to `validateSessionToken`, so when mobile login exists it sends a real session token and nothing else changes.

**Two web-side guards were adjusted for this:** `src/proxy.ts` exempts `/api/*` from the cookie-CSRF Origin check (these routes never read cookies), and `next.config.mjs` adds CORS headers on `/api/*` for the Expo web preview only.

Mobile side: `lib/api/client.ts` (`apiFetch`, `ApiError`) and `lib/api/meetings.ts` (`createMeeting`, `getMeeting`) — the analogue of the web's `@actions/...` and `@data/...` imports.

- **Rule:** to expose something new to mobile, add a route under `src/app/api/` that calls an existing `@actions` / `@data` function, put its request/response types in `packages/shared`, and add the matching function to `lib/api/`. Never reimplement server logic.

---

## 6. PR previews on a real device (Expo Go)

Every PR that touches `apps/mobile/**` or `packages/**` gets a build published as an **EAS Update**, and the `mobile-preview` workflow comments on the PR with a **QR code**. Scan it with [Expo Go](https://expo.dev/go) to run that exact commit on your phone — no Xcode, no local checkout. Only the newest commit on a PR is kept; the update is deleted when the PR closes (`mobile-preview-cleanup.yml`).

### Getting access

The QR code opens an update owned by the **`ethanchaos-team`** Expo organization, and Expo Go will only load it for accounts that belong to that org. To test PRs on a device:

1. Create an account at [expo.dev](https://expo.dev) if you don't have one.
2. Ask an org owner to add you to `ethanchaos-team` (Expo dashboard → Organization → Members).
3. Install Expo Go on your phone and **sign in with that account**.
4. Scan the QR code from the PR comment (iOS: Camera app; Android: Expo Go's scanner).

If Expo Go says the update can't be found or you're not authorised, you're either signed out or not yet a member of the org.

### Things to know

- **Forked PRs don't get a preview** — GitHub withholds secrets from forks. A maintainer can comment `/preview` on the PR to publish one.
- Add the **`no preview`** label to a PR to skip publishing (e.g. a docs-only change under `apps/mobile`).
- Previews target a stock Expo Go install (the update is keyed to the Expo SDK version, not a native build), so no dev client is needed.
- Previews can **read** meetings from the deployed API but can't **create** them until real mobile login exists — the dev token is never shipped in a bundle.

### CI setup (maintainers)

The workflow needs two things in the GitHub repo settings; it fails early with a message naming the missing one:

| Setting | Type | Where it comes from |
|---|---|---|
| `EXPO_TOKEN` | repository **secret** | A robot access token owned by `ethanchaos-team` — [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens). |
| `EAS_PROJECT_ID` | repository **variable** | The project's id from the Expo dashboard; `app.config.ts` reads it to set `updates.url`. |

---

## 7. Checklist for a new mobile screen

1. Find the web screen; note its route and component files.
2. Create the same route under `app/` and the same files under `components/`.
3. Build with `ui/` primitives, tokens, and `Icon.*`. No literals, no new icon files.
4. Need data? Add/extend an `/api` route that wraps existing server code; types in `packages/shared`; client fn in `lib/api/`.
5. Need a helper? Pure → `packages/shared` (+ web re-export). Native-picker maths → `lib/date.ts`.
6. Doc comment at the top: web counterpart + any deviation.
7. `pnpm --filter @zotmeet/mobile typecheck`, `pnpm --filter @zotmeet/shared typecheck`, `pnpm check` (Biome) — all must pass.

---

## 8. Known gaps

- No mobile login (dev token placeholder).
- Availability grid is presentational: hour rows, nothing painted, actions unwired.
- Meetings home is an empty state (needs `GET /api/meetings`).
- Location is collected but not sent (same as web today).
