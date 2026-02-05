DO $$ BEGIN
  CREATE TYPE "public"."group_role" AS ENUM('member', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

ALTER TABLE "users_in_group"
  ADD COLUMN IF NOT EXISTS "role" "group_role" DEFAULT 'member' NOT NULL;
