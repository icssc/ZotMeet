ALTER TABLE "meetings" ALTER COLUMN "from_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "to_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "scheduled_from_time" time;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "scheduled_to_time" time;