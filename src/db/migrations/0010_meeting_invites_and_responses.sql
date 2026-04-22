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
CREATE TABLE IF NOT EXISTS "meeting_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" uuid NOT NULL,
	"invite_token" text NOT NULL,
	"inviter_id" text NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "meeting_invites_invite_token_unique" UNIQUE("invite_token")
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting_invites" ADD CONSTRAINT "meeting_invites_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting_invites" ADD CONSTRAINT "meeting_invites_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
