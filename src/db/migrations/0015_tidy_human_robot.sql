ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "google_name" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "username" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "year" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "school" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "profile_picture" text;--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'members_username_unique') THEN
    ALTER TABLE "members" ADD CONSTRAINT "members_username_unique" UNIQUE("username");
  END IF;
END $$;