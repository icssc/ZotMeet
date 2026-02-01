DO $$ BEGIN
  CREATE TYPE "public"."group_role" AS ENUM ('member', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

ALTER TABLE "users_in_group"
  ADD COLUMN IF NOT EXISTS "role" "group_role" DEFAULT 'member' NOT NULL;
--> statement-breakpoint

DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users_in_group'
      AND column_name = 'is_admin'
  ) THEN
    UPDATE "users_in_group"
    SET "role" = 'admin'
    WHERE "is_admin" = true;
  END IF;
END $$;
--> statement-breakpoint

ALTER TABLE "users_in_group" DROP COLUMN IF EXISTS "is_admin";
