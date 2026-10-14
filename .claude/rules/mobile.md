---
paths:
  - "apps/mobile/**"
---

# Mobile (`apps/mobile/`) standards

- **No MUI** (Biome blocks `@mui/*`). Use the `src/components/ui/*` primitives, which copy MUI's prop vocabulary (`Button variant="contained"`, `Typography variant="h6" color="textSecondary"`, `IconButton size="small"`). Check that folder and the web's `components/ui` before building a new primitive; keep MUI prop names so Figma specs and web snippets port 1:1.
- **Styling:** NativeWind `className` only. `StyleSheet` / inline `style` only for values classes can't express (measured layout, animated values).
- **Tokens:** `bg-primary`, `text-muted-foreground`, etc. Raw colour props (`placeholderTextColor`, navigator tints) → `colorsFor(colorScheme)` from `lib/theme.ts`.
- **Type ramp:** `text-h6`, `text-body2`, `text-caption`, `text-button-md`. Weights are font families (`font-figtree-medium/semibold/bold`); `font-bold` does nothing. Adding a `fontSize` or `borderRadius` key to `tailwind.config.js` **requires** adding it to the `extendTailwindMerge` list in `src/lib/utils.ts`.
- **Icons:** `<Icon name="more-vert" />` from `lib/icons.tsx` (Material Icons, MUI name kebab-cased). No SVG exports.
- **Navigation:** Expo Router with typed routes. Mirror web paths (`/availability/[slug]`, `/groups/[id]`).
- **Data:** `lib/api/client.ts` `apiFetch` → `lib/api/<domain>.ts` functions → hooks in `hooks/`. Validate request bodies with the shared zod schema before sending. Screens never call `apiFetch` directly.
- **Animation/gesture:** `react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`. No `Animated` from `react-native` (Biome blocks it, and blocks `import * as` from `react-native` so it can't be reached that way).
- **Auth:** `useAuthStore` is the only reader of session state. The token lives in `expo-secure-store` — never AsyncStorage (Biome blocks it), never logged.
- **Dev token** (`EXPO_PUBLIC_API_TOKEN`) is read only under `__DEV__`; never put it in `eas.json` or `app.config.ts`.
- A component that mirrors a web file starts with a doc comment naming that file and what deviates.
