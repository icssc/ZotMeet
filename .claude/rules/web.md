---
paths:
  - "src/**"
---

# Web (`src/`) standards

- **UI library is MUI 7** (`@mui/material`, `@mui/icons-material` named imports). `src/components/ui/` holds shadcn/Radix leftovers — don't add new shadcn components.
- **Styling order of preference:** an MUI prop (`variant`, `size`, `color="inherit"`) → Tailwind `className` → `sx`. Layout wrappers are plain `<div>`s with classes, not `<Box sx={{ display: "flex" }}>`.
- Use `sx` only for:
  - overriding a property the MUI component already sets (a `Button`'s background, an `IconButton`'s radius, a `Typography`'s size) — MUI's styles load after Tailwind's and win ties, so a class silently does nothing there;
  - theme values with no Tailwind token (`palette.primary.light`, gradients built from palette entries);
  - MUI states and slots (`"&:hover"`, `"& .MuiSvgIcon-root"`).
- When you edit a component, move its layout `sx` to classes; don't sweep untouched files. Reference: `src/components/footer/footer.tsx`.
- **Theme:** `src/theme.ts` `getTheme(mode)`; colours via `hsl()` from tokens. Dark mode is the `.dark` class. Fonts: `src/fonts.ts` (Figtree).
- **Breakpoints:** Tailwind `md`/`lg` are 768/1024px; MUI's are 900/1200px. Never hide one element with a Tailwind class and decide a related one with `useMediaQuery(theme.breakpoints…)` — pick one system per pair of elements.
- **Routing:** App Router, `next/navigation`, `next/link`. URL-persisted form state: `nuqs`.
- **Data:** server components + server actions (`@actions/<entity>/<verb>/action.ts`, `@data/<entity>/queries.ts`). No client-side fetch layer (no React Query/SWR).
- **Forms:** plain `useState`. `react-hook-form` is installed but unused — don't use it (Biome blocks the import).
- **Auth:** `getCurrentSession()` from `@/lib/auth` in RSC, actions and routes; `getMemberIdFromBearer` in API routes only.
- **Server vs client:** components are server components unless they need state, effects, browser APIs or event handlers. Put `"use client"` on the smallest leaf that needs it, and pass server-fetched data down as props rather than fetching in the client component.
