DROP TABLE "meeting_dates";--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "host_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "availabilities" DROP COLUMN IF EXISTS "availability_string";