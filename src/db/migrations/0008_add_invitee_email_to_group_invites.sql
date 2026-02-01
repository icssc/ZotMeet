-- Add invitee_email for DBs that have it as NOT NULL (e.g. staging).
-- Safe for DBs that already have the column (ignored if column exists).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_invites' AND column_name = 'invitee_email'
  ) THEN
    ALTER TABLE "group_invites" ADD COLUMN "invitee_email" text NOT NULL DEFAULT '';
  END IF;
END $$;
