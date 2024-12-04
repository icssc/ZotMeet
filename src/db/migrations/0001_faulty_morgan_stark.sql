ALTER TABLE "users" RENAME COLUMN "password" TO "password_hash";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "auth_methods";