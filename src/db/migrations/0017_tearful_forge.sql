-- Drop the members_in_meeting table
DROP TABLE IF EXISTS "members_in_meeting";

-- Drop existing constraints
ALTER TABLE "availabilities" DROP CONSTRAINT IF EXISTS "availabilities_meeting_day_meeting_dates_id_fk";
ALTER TABLE "availabilities" DROP CONSTRAINT IF EXISTS "availabilities_member_id_meeting_day_pk";

-- Ensure the attendance enum type is created
DO $$ BEGIN
    CREATE TYPE "public"."attendance" AS ENUM('accepted', 'maybe', 'declined');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop default and not null constraints if needed
ALTER TABLE "availabilities" ALTER COLUMN "availability" DROP DEFAULT;
ALTER TABLE "availabilities" ALTER COLUMN "availability" DROP NOT NULL;

-- Add new constraints and columns
ALTER TABLE "availabilities" ADD COLUMN "meeting_id" uuid NOT NULL;
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_member_id_meeting_id_pk" PRIMARY KEY("member_id", "meeting_id");
ALTER TABLE "availabilities" ADD COLUMN "meeting_availabilities" jsonb DEFAULT '[]'::jsonb NOT NULL;

-- Add foreign key constraint
DO $$ BEGIN
    ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop old columns if they exist
ALTER TABLE "availabilities" DROP COLUMN IF EXISTS "meeting_day";
ALTER TABLE "availabilities" DROP COLUMN IF EXISTS "block_length";