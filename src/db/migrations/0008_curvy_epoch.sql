DO $$ BEGIN
    CREATE TYPE "public"."theme_mode" AS ENUM('light', 'dark', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "theme_mode" "theme_mode" DEFAULT 'light' NOT NULL;
