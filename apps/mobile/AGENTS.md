# Mobile (`apps/mobile/`): Expo

Repo-wide rules are in [../../AGENTS.md](../../AGENTS.md). The component catalog is in [../../docs/design-system.md](../../docs/design-system.md). Setup, the sign-in flow and PR previews are covered in [README.md](README.md).

## Mirror the web

- **Same route paths, folder names, file names and component names** as `src/`. To build a screen, open the web version first and copy how it's split into components.
- **Start each file with a comment** naming its web counterpart and anything that differs.

## Components: our MUI look-alikes

MUI doesn't run on React Native. `src/components/ui/*` rebuilds the pieces we need **with MUI's prop names**, so Figma specs and web snippets port 1:1:

```tsx
<Button variant="contained" size="small" label="Save" />
<Typography variant="h6" color="textSecondary">Title</Typography>
<IconButton size="small"><Icon name="more-vert" /></IconButton>
```

- Check `components/ui/` (and the web's) before building a new primitive. Keep the MUI prop names.
- These primitives are built on RN core, `@rn-primitives` (dialog, tabs, portal) and `class-variance-authority`.
- **Banned (enforced by Biome):** `@mui/*`, `next/*` and server-only packages.

## Styling

- **Use NativeWind `className` only.** Use `style`/`StyleSheet` only for values a class can't express (measured layout, animated values).
- **Colours are tokens:** `bg-primary`, `text-muted-foreground`. RN props that need a raw colour (`placeholderTextColor`, navigator tints) get it from `colorsFor(colorScheme)` in `lib/theme.ts`.
- **Type ramp:** `text-h6`, `text-body2`, `text-caption`, `text-button-md`. Prefer `<Typography variant>`.
- **Font weights are separate families:** `font-figtree-medium`, `-semibold`, `-bold`. `font-bold` does nothing.
- **Adding a `fontSize` or `borderRadius` key** to `tailwind.config.js` means adding it to `extendTailwindMerge` in `src/lib/utils.ts` too. Otherwise it gets silently dropped.

## Icons

Use `<Icon name="more-vert" />` from `lib/icons.tsx`. Names are the MUI icon names in kebab-case (`MoreVert` → `more-vert`). Don't export SVGs.

## Animation & gestures

- **Animation:** `react-native-reanimated` only. `Animated` from `react-native` is banned by Biome.
- **`Animated.View` with a `className`:** import `Animated` from `@/lib/animated`, or the web preview drops the styles.
- **Gestures:** `react-native-gesture-handler`. **Haptics:** `expo-haptics`.

## Data

```
lib/api/client.ts (apiFetch) → lib/api/<domain>.ts → hooks/use-x.ts → component
```

- Validate request bodies with the shared zod schema before sending.
- Never reimplement server logic here. If data is missing, add an API route (see [../../AGENTS.md](../../AGENTS.md#shared-backend-across-mobile--web-apps)).

## Auth

- `useAuthStore` is the only thing that reads session state.
- The token lives in `expo-secure-store`. Never put it in AsyncStorage (banned) and never log it.
- The dev token `EXPO_PUBLIC_API_TOKEN` is only read under `__DEV__`. Never put it in `eas.json` or `app.config.ts`.

## Gotchas

- `EXPO_PUBLIC_*` vars are inlined at bundle time. Restart Expo after changing them.
- TypeScript here is 6.0 (web is 5.9).
- `app.config.ts` reuses bundle id `com.zotmeet` from the old `ios/` wrapper. Resolve that before any EAS store build.
