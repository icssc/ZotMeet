# Design system

**The Figma designs are drawn in MUI.** Web renders them with MUI. Mobile can't run MUI, so it rebuilds the same components with **MUI's names and props**. That means one design spec, one vocabulary, and two renderers.

```
           Figma (MUI components)
                    │
        ┌───────────┴────────────┐
   Web: MUI 7               Mobile: components/ui/*
   + Tailwind               + NativeWind
        └───────────┬────────────┘
         @zotmeet/tokens (colours, radius, type)
```

## Tokens: `packages/tokens`

| Kind | Use as | Notes |
|---|---|---|
| Colours | `bg-primary`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-paper` | CSS variables, so dark mode flips them automatically. Never write a colour literal. |
| MUI ink colours (**mobile only**) | `text-action-active`, `text-text-disabled`, `border-input-outlined`, `bg-primary-tint`, `bg-primary-ledge` | MUI's translucent greys, pre-blended because RN can't blend. Web doesn't have these classes: MUI draws those colours itself. |
| Radius | `rounded-lg` / `md` / `sm` (`--radius` = 0.3rem); mobile `rounded-control` = MUI's 4px | |
| Type ramp | `h1`–`h6`, `subtitle1/2`, `body1/2`, `caption`, `overline` (both apps); `text-button-sm/md/lg` (mobile only) | Web: `<Typography variant>`. Mobile: `<Typography variant>` or `text-h6`. |
| Font | Figtree | Mobile weights are separate families (`font-figtree-semibold`). |

## Components: web ↔ mobile

**Rule:** before building a component, check both `components/ui/` folders. On mobile, keep the MUI prop names.

| Need | Web | Mobile (`apps/mobile/src/components/ui/`) |
|---|---|---|
| Button | MUI `Button` | `Button`: `variant` contained/outlined/text, `size` small/medium/large/square, `label` |
| Icon button | MUI `IconButton` | `IconButton`: same variants, plus `edge` |
| Text | MUI `Typography` | `Typography` (same `variant`/`color`/`align`/`noWrap`); `Text` for unstyled text |
| Text field | MUI `TextField` (outlined) | `Input` (built on `FieldShell`) |
| Time picker | `@mui/x-date-pickers` `TimePicker` | `TimeField` (native picker in a field-shaped `FieldButton`) |
| Label / helper text | MUI `FormLabel` / `FormHelperText` | `FormLabel` / `FormHelperText` in `form.tsx` |
| Dialog | MUI `Dialog` | `Dialog` (`@rn-primitives/dialog`) |
| Tabs | MUI `Tabs` | `Tabs` + `<TabsList variant="underline">` (the default `segmented` is the old shadcn look) |
| Bottom sheet | `ui/mui/mui-bottom-sheet` | Expo Router `presentation: "modal"` + `SheetGrabber` (not `formSheet`: it renders blank) |
| Card | `ui/mui/card` | `Card` |
| Option card | n/a | `SelectableCard` (Figma "Member") |
| Filter chip | `ui/filter-chip` | `FilterChip` |
| Meeting card | `ui/meeting-card` | `MeetingCard` (same view model from `@zotmeet/shared`) |
| Calendar | `components/creation/calendar/*` | `Calendar` + `DayCell` |
| Toast | `useSnackbar()` (`ui/snackbar-provider`) | Not built yet. Show errors inline. |
| Page chrome | `<div className="px-4 py-8 sm:px-8">` | `Screen` (safe area + title + scroll) |

## The "3D" ledge

Buttons and selectable cards have a solid 4px ledge underneath and sink into it when pressed.

- **Web:** a blur-less `box-shadow` plus `translateY(4px)`, set in `src/theme.ts`.
- **Mobile:** `Raised` (`ui/raised.tsx`) draws the ledge as a real view, because RN can't do that shadow. `Button`, `IconButton` and `SelectableCard` already use it.

## Icons

Material Icons on both apps.

| | Web | Mobile |
|---|---|---|
| Usage | `import MoreVert from "@mui/icons-material/MoreVert"` | `<Icon name="more-vert" />` |
| Colour | `color` prop | `className="text-…"` |

Don't export SVG icons from Figma. `lucide-react` is legacy on web.

## Dark mode

Both apps flip the token set: web with the `.dark` class, mobile with NativeWind's `useColorScheme()`. If you use tokens, dark mode works automatically. A colour literal breaks it.
