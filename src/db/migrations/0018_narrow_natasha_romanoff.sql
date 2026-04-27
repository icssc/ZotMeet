-- Backfill: existing rows kept `true` from when the column defaulted to true.
-- New default is false; align stored values for users who never chose a preference.
UPDATE "users" SET "email_notifications" = false;
