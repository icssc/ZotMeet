/**
 * `@zotmeet/shared` — domain code used by both the web app and the Expo app.
 *
 * Everything here must stay pure: no DOM, no `next/*`, no `@/db`, nothing
 * `server-only`. The web app re-exports these from its original module paths
 * (`src/lib/types/chrono.ts`, `src/lib/availability/utils.ts`); the mobile
 * app imports the package directly.
 */

export * from "./auth/native";
export * from "./auth/providers";
export * from "./auth/return-to";
export * from "./auth/user";
export * from "./chrono/time";
export * from "./chrono/types";
export * from "./meetings/card";
export * from "./meetings/schema";
export * from "./meetings/utils";
