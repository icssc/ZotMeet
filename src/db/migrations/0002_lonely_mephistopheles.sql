DO $$ BEGIN
    CREATE TYPE "public"."meeting_type" AS ENUM('dates', 'days');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "meetings" ADD COLUMN "meeting_type" "meeting_type" DEFAULT 'dates' NOT NULL;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;