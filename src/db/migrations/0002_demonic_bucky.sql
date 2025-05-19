CREATE TYPE "public"."meeting_type" AS ENUM('specificDates', 'recurringWeekly');--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "dates" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "dates" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "meeting_type" "meeting_type" DEFAULT 'specificDates' NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "recurring_days" jsonb;