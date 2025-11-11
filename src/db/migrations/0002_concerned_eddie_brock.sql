ALTER TABLE "meetings" ALTER COLUMN "from_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "to_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "scheduled_date" timestamp;