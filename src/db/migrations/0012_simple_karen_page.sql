CREATE TABLE IF NOT EXISTS "meeting_invite_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invite_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"status" "invite_status" DEFAULT 'pending' NOT NULL,
	"responded_at" timestamp,
	CONSTRAINT "meeting_invite_responses_invite_user_unique" UNIQUE("invite_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting_invite_responses" ADD CONSTRAINT "meeting_invite_responses_invite_id_meeting_invites_id_fk" FOREIGN KEY ("invite_id") REFERENCES "public"."meeting_invites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting_invite_responses" ADD CONSTRAINT "meeting_invite_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
