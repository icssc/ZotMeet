CREATE TYPE "public"."theme_mode" AS ENUM('light', 'dark', 'system');

ALTER TABLE "users" ADD COLUMN "theme_mode" "theme_mode" DEFAULT 'light' NOT NULL;