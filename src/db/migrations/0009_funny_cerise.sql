CREATE TYPE "public"."group_role" AS ENUM('member', 'admin');--> statement-breakpoint
ALTER TABLE "users_in_group" ADD COLUMN "role" "group_role" DEFAULT 'member' NOT NULL;