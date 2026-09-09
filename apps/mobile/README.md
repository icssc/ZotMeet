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

## Installed but deliberately unused

`react-native-gesture-handler`, `react-native-reanimated`,
`react-native-worklets`, and `expo-haptics` are installed and configured
(babel plugin, `GestureHandlerRootView`) so the draggable availability grid can
be built later without dependency churn. Nothing uses them yet.

## Known TODOs

- `android.package` in `app.config.ts` is a placeholder (`com.zotmeet.app`).
  No Android app exists; pick a real package name before any Play Store work.
- No EAS Build / TestFlight / CI configuration, by design.
