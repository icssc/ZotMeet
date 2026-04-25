ALTER TABLE "members" ADD COLUMN "google_name" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "year" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "school" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "profile_picture" text;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_username_unique" UNIQUE("username");