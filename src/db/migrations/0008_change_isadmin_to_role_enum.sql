CREATE TYPE "public"."group_role" AS ENUM('member', 'admin');--> statement-breakpoint
ALTER TABLE "users_in_group" ADD COLUMN "role" "group_role" DEFAULT 'member' NOT NULL;--> statement-breakpoint
UPDATE "users_in_group" SET "role" = 'admin' WHERE "is_admin" = true;--> statement-breakpoint
ALTER TABLE "users_in_group" DROP COLUMN IF EXISTS "is_admin";