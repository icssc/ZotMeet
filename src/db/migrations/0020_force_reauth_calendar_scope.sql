-- One-time: sign everyone out so each user goes through Google login again.
-- Sessions created before the Google Calendar write feature hold tokens without
-- the `calendar.events.owned` scope, and the scope is only granted at login, so
-- those users could not sync events until they happened to sign in again.
-- Signing in re-requests every scope and shows Google's consent screen.
-- Covers web cookies and the Expo app's bearer tokens (both are rows here).
DELETE FROM "sessions";
