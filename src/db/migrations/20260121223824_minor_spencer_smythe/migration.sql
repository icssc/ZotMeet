CREATE TABLE IF NOT EXISTS "scheduled_meetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" uuid NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"scheduled_from_time" time NOT NULL,
	"scheduled_to_time" time NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scheduled_meetings" ADD CONSTRAINT "scheduled_meetings_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
