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
| root `.env` | `MOBILE_DEV_API_TOKEN`, `MOBILE_DEV_HOST_MEMBER_ID` | Dev-only auth for the API — ignored when the server runs with `NODE_ENV=production`. Member id `00000000-0000-0000-0000-000000000000` is "Seed Admin" from `pnpm db:seed`. |
| `apps/mobile/.env.local` | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_API_TOKEN` | Token must equal the root one. Use your Mac's LAN IP instead of `localhost` on a physical device. |

`EXPO_PUBLIC_*` values are inlined into the JS bundle at build time — restart Expo after changing them, and never put the token in `eas.json` or `app.config.ts`.

The dev token is optional once you sign in (§5): it is only the fallback `apiFetch` uses while signed out. It is a **shared** credential that impersonates one member, so it is fenced to local development at both ends: the client reads it only under `__DEV__`, and the server ignores it under `NODE_ENV=production`. A distributed bundle carries no token and is unauthenticated until the user signs in.

**Signing in locally:** Google sign-in round-trips through the web app on `:3000` and ICSSC (§5). The iOS Simulator and the `w` web preview work out of the box — `EXPO_PUBLIC_API_URL` can be `localhost` or your LAN address, because ICSSC returns to `NEXT_PUBLIC_BASE_URL` (`localhost:3000`), which on the simulator is your Mac. On a **physical device** that return address is the phone itself, so the flow cannot complete unless `NEXT_PUBLIC_BASE_URL` is your LAN address *and* registered with ICSSC. Use the simulator, or the dev token, for device testing until then.

---

## 1. Repo layout

```
/                      Next.js web app (unchanged in role — production + PWA)
├── src/               web source
├── apps/mobile/       Expo app (this guide)
│   └── src/
│       ├── app/           expo-router routes — same paths as web (see §3)
│       ├── components/    same folder names as web src/components (see §3)
│       ├── lib/           icons, theme, date maths, API client, auth (mirrors web src/lib/auth)
│       ├── hooks/         data hooks (useMeeting)
│       └── store/         zustand stores, same names as web src/store (+ useAuthStore)
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

All icons are **Material Icons** (`@react-native-vector-icons/material-icons`) via `<Icon name="…" />` (e.g. `<Icon name="chevron-left" size={20} className="text-action-active" />`). Names are the web app's `@mui/icons-material` imports kebab-cased — `MoreVert` → `more-vert`, `NotificationsNone` → `notifications-none` — so a Figma spec or a web component ports 1:1 and `name` autocompletes. Don't export SVGs from Figma. The glyph is a `<Text>`, so `text-*` classes colour it; the wrapper defaults to `text-foreground` so icons survive dark mode. The font is loaded next to Figtree in the root layout, so nothing is registered per icon and no native config or prebuild is needed (works in Expo Go).

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
| `app/auth/login/page.tsx` | `components/auth/sign-in.tsx`, shown by the Profile tab while signed out | ✅ |
| `components/auth/{sign-in-buttons, google-button, apple-button, google-logo}.tsx` | same | ✅ Google; Apple button declines until a native flow exists |
| `app/auth/login/google/callback/route.tsx` | `app/auth/login/google/callback.tsx` | ✅ deep-link arrival only (see §5) |
| `lib/auth/{start-oauth-login, handle-oauth-callback, oauth, session, index}.ts` | same names | ✅ see §5 for what each mirrors |
| `components/nav/mui-bottom-nav.tsx` | `app/(tabs)/_layout.tsx` | ✅ Profile ⇄ Sign In and Availability ⇄ Rooms swap on the session |

Where a mobile file must deviate (e.g. web renders a `<table>`, mobile uses flex columns), the doc comment at the top of the file says what differs and why.

- **Rule:** same name, same responsibility, documented deviation. Don't invent a new folder when the web already has one.

---

## 4. Shared logic: `packages/shared` (`@zotmeet/shared`)

Anything both apps need that is **pure** (no DOM, no `next/*`, no DB) lives here.

```
packages/shared/src/
├── auth/providers.ts   OAUTH_LOGIN_CONFIG (paths, scopes), OAuthLoginProvider, isOAuthLoginProvider
├── auth/return-to.ts   safeReturnTo, loginPathWithReturnTo, oauthLoginPath
├── auth/user.ts        UserProfile — the signed-in user as both apps see them
├── auth/native.ts      the native sign-in contract: nativeOAuthLoginPath, isAllowedNativeRedirectUri,
│                       nativeOAuthTokenRequestSchema, SessionResponse, NativeOAuthTokenResponse (see §5)
├── chrono/types.ts     HourMinuteString, ANCHOR_DATES, Weekday, isAnchorDateMeeting, …
├── chrono/time.ts      convertTimeToUTC, convertTimeFromUTC, sortMeetingIsoDatesAsc,
│                       formatTimeWithHoursAndMins, formatDateToUSNumeric, localMidnightFromIsoDate, …
└── meetings/schema.ts  createMeetingSchema (zod), CreateMeetingInput, MeetingResponse, ApiErrorResponse
```

- The web files that used to own these (`src/lib/types/chrono.ts`, `src/lib/availability/utils.ts`, `src/lib/auth/{providers,return-to,user}.ts`) now **re-export** them, so web imports didn't change. Mobile imports `@zotmeet/shared` directly.
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
| `POST /api/auth/login/google` | `exchangeOAuthCode` + `establishOAuthSession` (`src/lib/auth/handle-oauth-callback.ts`) — the same two halves the browser callback runs | none → 201 `{ token, expiresAt, user }` |
| `GET /api/auth/session` | `validateSessionToken` (`src/lib/auth/session.ts`), the web's `getCurrentSession` | bearer → `{ expiresAt, user }` or 401 |
| `POST /api/auth/logout` | `invalidateSession`, the web's `logoutAction` | bearer → 204, idempotent |

**Auth** (`src/lib/auth/bearer.ts`): mobile sends `Authorization: Bearer <token>`. The token is a real session token — the same value the web keeps in its `session` cookie — issued by `POST /api/auth/login/google` at the end of the native sign-in; while signed out in local dev, the **dev token** maps to the seeded member instead.

**How native sign-in works** (the contract is `packages/shared/src/auth/native.ts`; the mobile files mirror the web's `src/lib/auth/` by name):

1. `lib/auth/start-oauth-login.ts` mints a `state` and a PKCE verifier on the device (`lib/auth/oauth.ts`, on `expo-crypto`), stores them (`lib/auth/session.ts`), and opens **the web app's own login route** in an in-app browser: `/auth/login/google?client=expo&state=…&code_challenge=…&redirect_uri=…`. The web app stays the OIDC client — it holds the ICSSC client id and the registered redirect URIs — and the app is a PKCE client *of the web app*.
2. The web's `startOAuthLogin` forwards the app's challenge to ICSSC instead of minting its own verifier, and wraps the app's state together with its callback link into the OAuth `state` (`src/lib/auth/native-state.ts`). Nothing is kept in a cookie: in dev the app opens the login route on your LAN address while ICSSC returns to `NEXT_PUBLIC_BASE_URL` (localhost), and no cookie survives that host change — the state does, because ICSSC echoes it verbatim. The callback link is checked against an allowlist at both ends: `zotmeet://…` always, `exp://…` and `http://localhost` only outside production.
3. ICSSC returns the code to the web callback as usual. Seeing the native envelope in `state`, `handleOAuthCallback` does not redeem the code; it bounces `code` + the app's original `state` to the app's link (`zotmeet://auth/login/google/callback`, or `exp://…/--/auth/login/google/callback` in Expo Go).
4. `lib/auth/handle-oauth-callback.ts` checks the state, then `POST /api/auth/login/google` with the code and the verifier that never left the device. The response carries the session token, which goes into the keychain via `expo-secure-store`; `apiFetch` sends it from then on.

A code crossing the app's deep link is useless without the verifier, so a rogue app squatting the URL scheme learns nothing (RFC 8252). Both arrivals of the callback link — `openAuthSessionAsync` resolving, and the router opening `app/auth/login/google/callback.tsx` (Android can relaunch the app on the link; the web preview lands it in the popup) — go through one de-duplicated handler.

On launch, `useAuthStore().hydrate` runs `lib/auth/index.ts#getCurrentSession` → `GET /api/auth/session`; the root layout holds the splash screen until it answers, and a 401 forgets the token. `signOut` calls `POST /api/auth/logout` best-effort and always clears the device.

**Signing out fully.** The web's `logoutAction` also sends the browser through ICSSC's end-session endpoint (`src/lib/auth/oidc-logout.ts`), otherwise the next sign-in silently reuses the last Google account. The app gets the same result differently: the in-app browser runs as an ephemeral session (`preferEphemeralSession` in `start-oauth-login.ts`), so no ICSSC or Google cookie ever exists outside the app and every sign-in starts at the account chooser — no logout round trip needed. That option is iOS-only; on Android the custom tab shares Chrome's cookies, so an ICSSC end-session hop on sign-out is still to do there.

**Two web-side guards were adjusted for this:** `src/proxy.ts` exempts `/api/*` from the cookie-CSRF Origin check (these routes never read cookies), and `next.config.mjs` adds CORS headers on `/api/*` for the Expo web preview only.

Mobile side: `lib/api/client.ts` (`apiFetch`, `ApiError`) and `lib/api/meetings.ts` (`createMeeting`, `getMeeting`) — the analogue of the web's `@actions/...` and `@data/...` imports.

- **Rule:** to expose something new to mobile, add a route under `src/app/api/` that calls an existing `@actions` / `@data` function, put its request/response types in `packages/shared`, and add the matching function to `lib/api/` (`lib/api/auth.ts` is the auth one). Never reimplement server logic.

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
- Previews carry no dev token. Signing in from a preview needs the deployed server to accept an `exp://` redirect, which it does not in production (see §5, step 2) — previews are read-only until the app ships under its own `zotmeet://` scheme.

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
3. Build with `ui/` primitives, tokens, and `<Icon name="…" />`. No literals, no new icon files.
4. Need data? Add/extend an `/api` route that wraps existing server code; types in `packages/shared`; client fn in `lib/api/`.
5. Need a helper? Pure → `packages/shared` (+ web re-export). Native-picker maths → `lib/date.ts`.
6. Doc comment at the top: web counterpart + any deviation.
7. `pnpm --filter @zotmeet/mobile typecheck`, `pnpm --filter @zotmeet/shared typecheck`, `pnpm check` (Biome) — all must pass.

---

## 8. Known gaps

- Sign in with Apple: the button is there, but the App Store requires a native flow (not a web view), which is not built; the store declines it with a message.
- Sign-in from a physical device against a local server (see Quick start), and from Expo Go previews against production (§6).
- Android sign-out does not end the ICSSC/Google browser session (§5, "Signing out fully"), so the next sign-in may skip the account chooser there.
- Availability grid is presentational: hour rows, nothing painted, actions unwired.
- Meetings home is an empty state (needs `GET /api/meetings`).
- Location is collected but not sent (same as web today).
