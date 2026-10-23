# `@zotmeet/tokens`: design tokens for both apps

Repo-wide rules are in [../../AGENTS.md](../../AGENTS.md). How the tokens are used is covered in [../../docs/design-system.md](../../docs/design-system.md).

| File | Owns | Read by |
|---|---|---|
| `index.js` | Colour tokens (light/dark HSL channels), MUI ink colours, brand hex | Both Tailwind configs, `src/theme.ts`, manifest, icon script, `app.config.ts` |
| `tailwind.js` | Tailwind colour + radius wiring. `nativeInkColors` is **mobile only**, and the web config must not spread it. | Both Tailwind configs |
| `typography.js` | Type ramp (h1–h6, body1/2, caption, overline, button) | `muiTypography()` → `src/theme.ts`; `tailwindFontSize()` → Expo config |

## Rules

- **Every colour, radius and font size starts here.** Never put a hex/HSL/px literal in a component, theme or Tailwind config.
- **Values come from Figma.** Changing an existing value needs a design sign-off. Adding a new token is fine.
- The package is plain CommonJS, so keep it dependency-free and keep the `.d.ts` files in sync.
- Mobile only: a new `fontSize` or radius key also goes in `apps/mobile/src/lib/utils.ts` (`extendTailwindMerge`).
