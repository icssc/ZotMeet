ALTER TABLE "users_in_group" ADD COLUMN IF NOT EXISTS "is_admin" boolean DEFAULT false NOT NULL;
