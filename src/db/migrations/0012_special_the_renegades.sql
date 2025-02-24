ALTER TABLE "meetings" ADD COLUMN "timezone" text DEFAULT 'PST' NOT NULL;--> statement-breakpoint
DROP TYPE "public"."timezone";