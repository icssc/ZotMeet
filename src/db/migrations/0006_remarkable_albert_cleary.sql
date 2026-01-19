CREATE TABLE IF NOT EXISTS "group_invite_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invite_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"status" "invite_status" DEFAULT 'pending' NOT NULL,
	"responded_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_invite_responses" ADD CONSTRAINT "group_invite_responses_invite_id_group_invites_id_fk" FOREIGN KEY ("invite_id") REFERENCES "public"."group_invites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_invite_responses" ADD CONSTRAINT "group_invite_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "group_invites" DROP COLUMN IF EXISTS "invitee_emails";--> statement-breakpoint
ALTER TABLE "group_invites" DROP COLUMN IF EXISTS "responded_at";