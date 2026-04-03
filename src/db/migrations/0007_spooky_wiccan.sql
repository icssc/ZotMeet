CREATE TYPE "public"."theme_mode" AS ENUM('light', 'dark', 'system');

ALTER TABLE "users"
ALTER COLUMN "theme_mode"
SET DATA TYPE theme_mode
USING "theme_mode"::theme_mode;