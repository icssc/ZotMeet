# Web (`src/`): Next.js 16

Web-only rules. Repo-wide rules are in [../AGENTS.md](../AGENTS.md).

**Components:** MUI 7 for everything (see [../docs/design-system.md](../docs/design-system.md)). The shadcn/Radix files in `components/ui/` and `lucide-react` are legacy: leave existing uses, don't add new ones.

## Styling

Check these in order and use the first one that works:

1. **An MUI prop:** `variant`, `size`, `color="inherit"`.
2. **A Tailwind `className`.** Layout wrappers are plain `<div className="flex …">`, not `<Box sx={{ display: "flex" }}>`.
3. **`sx`, only for:**
   - overriding a style MUI already sets (a `Button` background, an `IconButton` radius). MUI's CSS loads after Tailwind's, so a class there does nothing;
   - theme values with no Tailwind token (`palette.primary.light`, gradients);
   - states and slots (`"&:hover"`, `"& .MuiSvgIcon-root"`).

When you edit a component, move its layout `sx` into classes. Don't sweep through files you aren't otherwise touching. Reference: `src/components/footer/footer.tsx`.

**Breakpoints:** Tailwind's `md`/`lg` are 768/1024px, but MUI's are 900/1200px. Don't hide one element with a Tailwind class and show a related one with `useMediaQuery(theme.breakpoints…)`. The two won't switch at the same width.

## Server vs client

- **Pages are server components.** They call `getCurrentSession()`, load data from `@data/*`, and pass props down (see `src/app/summary/page.tsx`).
- **`"use client"` goes on the smallest leaf** that needs state, effects or browser APIs.
- **Mutations** use server actions at `@actions/<entity>/<verb>/action.ts`, each a thin wrapper around a `src/server/data/*` function (see [../AGENTS.md](../AGENTS.md#shared-backend-across-mobile--web-apps)).
- **Never write `export type { X }` in a `"use server"` file.** It breaks every server action at runtime, and neither tsc nor Biome catches it.
- **URL state** uses `nuqs`.

## Auth

- Pages, server components and actions use `getCurrentSession()` from `@/lib/auth`.
- `src/app/api/**` routes use `getMemberIdFromBearer` (the mobile token) instead.
