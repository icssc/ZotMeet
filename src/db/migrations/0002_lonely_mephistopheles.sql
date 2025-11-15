CREATE TYPE "public"."meeting_type" AS ENUM('dates', 'days');--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "meeting_type" "meeting_type" DEFAULT 'dates' NOT NULL;