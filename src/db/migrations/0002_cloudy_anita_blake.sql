ALTER TABLE "meetings" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "google_access_token" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "google_refresh_token" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "google_access_token_expires_at" timestamp with time zone;