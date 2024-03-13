DROP TABLE "zotmeet"."keys";--> statement-breakpoint
ALTER TABLE "zotmeet"."sessions" RENAME COLUMN "active_expires" TO "expires_at";--> statement-breakpoint
DROP INDEX IF EXISTS "user_idx_sessions";--> statement-breakpoint
ALTER TABLE "zotmeet"."sessions" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "zotmeet"."sessions" ("user_id");--> statement-breakpoint
ALTER TABLE "zotmeet"."sessions" DROP COLUMN IF EXISTS "idle_expires";