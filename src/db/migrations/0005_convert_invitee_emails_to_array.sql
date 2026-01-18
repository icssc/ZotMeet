-- Convert invitee_email from text to jsonb array
-- Step 1: Add new column as jsonb
ALTER TABLE "group_invites" ADD COLUMN "invitee_emails" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint

-- Step 2: Convert existing data: wrap single email in array
UPDATE "group_invites" 
SET "invitee_emails" = jsonb_build_array("invitee_email")
WHERE "invitee_email" IS NOT NULL;
--> statement-breakpoint

-- Step 3: Drop old column
ALTER TABLE "group_invites" DROP COLUMN "invitee_email";
--> statement-breakpoint
