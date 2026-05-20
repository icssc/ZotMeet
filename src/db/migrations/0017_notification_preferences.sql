CREATE TABLE IF NOT EXISTS "notification_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"meeting_invites" boolean DEFAULT true NOT NULL,
	"group_invites" boolean DEFAULT true NOT NULL,
	"nudges" boolean DEFAULT true NOT NULL,
	CONSTRAINT "notification_preferences_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
