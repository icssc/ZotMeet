DROP INDEX IF EXISTS "user_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx_sessions" ON "zotmeet"."sessions" ("user_id");