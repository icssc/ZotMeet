CREATE TYPE "public"."timezoneEnum" AS ENUM('PST', 'PDT', 'MST', 'MDT', 'CST', 'CDT', 'EST', 'EDT');--> statement-breakpoint

ALTER TABLE "availabilities" ADD COLUMN "availability" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "timezone" "public"."timezoneEnum" SET DEFAULT CAST ("PST" AS "public"."timezoneEnum") NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "dates" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "displayName" text NOT NULL;--> statement-breakpoint
