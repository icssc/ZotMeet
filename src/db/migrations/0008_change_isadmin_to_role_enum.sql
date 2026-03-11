DO $$ BEGIN
    CREATE TYPE "public"."group_role" AS ENUM('member', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;ALTER TABLE "users_in_group" ADD COLUMN IF NOT EXISTS "role" "group_role" DEFAULT 'member' NOT NULL;--> statement-breakpoint
UPDATE "users_in_group" SET "role" = 'admin' WHERE "is_admin" = true;--> statement-breakpoint
ALTER TABLE "users_in_group" DROP COLUMN IF EXISTS "is_admin";