---
paths:
  - "src/**/*.tsx"
  - "src/hooks/**"
  - "src/store/**"
  - "apps/mobile/src/**/*.tsx"
  - "apps/mobile/src/hooks/**"
  - "apps/mobile/src/store/**"
---

# React standards (both apps, React 19)

## Naming and files

- Filenames kebab-case; components are named `PascalCase` exports (no default exports outside Next.js `page`/`layout`/`loading` files and Expo Router route files). Four older components still default-export; leave them unless you're already editing one.
- Hooks are `use-x.ts`; zustand stores are `useXStore.ts`. One exported component per file; small private helpers in the same file are fine.

## State

- **Derive, don't sync.** If a value can be computed from props or state, compute it during render. Never `useState` + `useEffect` to mirror or transform another value.
- `useEffect` is for synchronising with something outside React (subscriptions, timers, DOM/native APIs, `matchMedia`). Not for responding to a user event — do that in the event handler. Not for fetching on web (server components do that).
- Keep state as local as possible; lift it only as far as the nearest component that needs it. Zustand is for state shared across distant parts of the tree.
- Read zustand with selectors; select several fields with `useShallow` (pattern: `src/components/availability/availability.tsx`). Never `useStore()` with no selector.

## Components and hooks

- When a component grows past ~250 lines or does two jobs (data shaping + layout, or two unrelated UI regions), extract a child component or a hook. Don't grow the existing large files (`availability.tsx`, `group-responses.tsx`, `add-member-dialog.tsx`); add new pieces as separate files.
- Extract a custom hook when stateful logic is reused or obscures the render. Pure logic goes in a plain function first (and in `@zotmeet/shared` if both apps could use it); the hook is a thin wrapper.
- Never define a component inside another component (Biome errors on this). Hooks only at the top level (Biome errors on this too).
- Props: a typed `Props`/`XProps` object, destructured in the signature. Event props are `onX`, handler functions `handleX`. No boolean props that flip a component into a different component — make two components.
- Lists need stable keys from the data (`id`), not the array index, unless the list is static and never reorders.

## Memoization

- Don't add `useMemo`/`useCallback`/`memo` by default. Use them when a value is passed to a memoized child, used as an effect dependency, or is measurably expensive (the availability grid and paint logic qualify).

## Errors and loading

- Every user-triggered async action shows pending state (disable the control or show progress) and surfaces failure to the user; never swallow a rejected promise with an empty `catch`.
