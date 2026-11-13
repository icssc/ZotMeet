CREATE TABLE IF NOT EXISTS "meeting_google_calendar_events" (
	"meeting_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"google_calendar_id" text DEFAULT 'primary' NOT NULL,
	"google_event_id" text NOT NULL,
	"last_synced_snapshot" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meeting_google_calendar_events_meeting_id_member_id_pk" PRIMARY KEY("meeting_id","member_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting_google_calendar_events" ADD CONSTRAINT "meeting_google_calendar_events_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting_google_calendar_events" ADD CONSTRAINT "meeting_google_calendar_events_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
