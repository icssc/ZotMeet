CREATE TYPE "public"."theme_mode" AS ENUM('light', 'dark', 'system');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "theme_mode" SET DATA TYPE theme_mode;