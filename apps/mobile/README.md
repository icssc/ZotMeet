# @zotmeet/mobile

Exploratory React Native client for ZotMeet. **Prototype only** — every screen
is static placeholder UI; there is no API client, data layer, or auth here.

## Running

From the repo root (after `pnpm install`):

```bash
pnpm mobile
```

Same as `pnpm --filter @zotmeet/mobile start`. Then press `i` / `a` / `w`, or scan the QR code with Expo Go. This is the mobile counterpart of the web app's `pnpm dev`.

## How this relates to the web app

- **Design tokens** in `src/global.css` are copied verbatim from the Next.js
  app's `src/app/globals.css`, and `tailwind.config.js` mirrors the root
  `tailwind.config.ts`. `bg-primary`, `text-muted-foreground`,
  `border-border`, etc. mean the same thing on both platforms. Keep them in
  sync by hand — there is no shared package yet.
- **Components** in `src/components/ui` are the rn-primitives analogues of the
  web app's Radix wrappers (`Dialog`, `Tabs`). MUI has no counterpart here and
  is not planned.
- **Navigation** in `src/app/(tabs)` loosely follows the web bottom nav in
  `src/components/nav/mui-bottom-nav.tsx`.

## Native dependencies

`react-native-gesture-handler` and `expo-haptics` are in use:
`src/components/ui/calendar.tsx` drives date selection with a `GestureDetector`
sweep and fires `Haptics.selectionAsync()` as the selection changes.
`react-native-reanimated` and `react-native-worklets` are installed and
configured (babel plugin, `GestureHandlerRootView`) but nothing imports them
directly yet.

That native behaviour is the reason PR review happens in Expo Go rather than a
browser.

## Reviewing a PR on a phone

Every PR touching the mobile bundle publishes an EAS Update to a `pr-<n>`
branch, and `.github/workflows/mobile-preview.yml` comments a QR code that opens
it in Expo Go — real haptics, real gesture physics, the native date picker.

Three things to know:

- **Reviewers need a free Expo account added to the `ethanchaos-team` org.**
  Since 2026-05-12 Expo Go only loads updates for projects you own or that
  belong to an org you belong to, so the QR is not shareable with an arbitrary
  person.
- **It only previews JS, asset and styling changes.** A PR adding a native
  module or config plugin publishes an update Expo Go cannot correctly run;
  those need a real dev build, which this repo does not do yet.
- Add the `no preview` label to skip a PR. Closing a PR deletes its update
  branch.

A `react-native-web` static preview was built and then removed: haptics no-op in
a browser and gestures degrade to pointer events, so it could not exercise the
calendar — the main thing worth reviewing.

### Testing without any account

`pnpm mobile` from the repo root starts Metro and prints a QR. Scanning it
connects Expo Go directly to your machine over LAN — it touches none of Expo's
servers and needs no login. Full native behaviour, nothing to configure; the
cost is checking the branch out first.

## Handoff / operations

Two repo-level GitHub Actions settings, configured once:

- **`EXPO_TOKEN`** (secret) — must be a **robot** token created under the
  `ethanchaos-team` org at <https://expo.dev/settings/access-tokens>, never a
  personal access token. A robot token has no human owner, so it survives a
  maintainer leaving. Confirm the Expo *project* is owned by the org too, not by
  an individual's account.
- **`EAS_PROJECT_ID`** (variable) — `app.config.ts` reads it from the
  environment and omits `updates.url` and `extra.eas` entirely when unset. If
  `pnpm exec expo config --type public` shows no `extra.eas`, that variable is
  missing; it is not a config bug.

Onboarding a reviewer means adding their Expo account to the org. If that ever
outweighs the benefit, `pnpm mobile` above needs none of it.

Installing on a physical iPhone outside Expo Go requires an Apple Developer
account ($99/yr) regardless of tooling; that cost is Apple's, not Expo's.

## Known TODOs

- `android.package` in `app.config.ts` is a placeholder (`com.zotmeet.app`).
  No Android app exists; pick a real package name before any Play Store work.
- No EAS Build / TestFlight configuration — EAS Update (OTA previews) only, so
  there is no way to review a PR that adds native code.
