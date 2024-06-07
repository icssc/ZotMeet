DO $$ BEGIN
 CREATE TYPE "attendance" AS ENUM('accepted', 'maybe', 'declined');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "availabilities" (
	"member_id" text NOT NULL,
	"meeting_day" uuid NOT NULL,
	"block_length" smallint DEFAULT 15 NOT NULL,
	"availability_string" text NOT NULL,
	CONSTRAINT "availabilities_member_id_meeting_day_pk" PRIMARY KEY("member_id","meeting_day")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guests" (
	"id" text NOT NULL,
	"username" text NOT NULL,
	"meeting_id" uuid,
	CONSTRAINT "guests_username_meeting_id_pk" PRIMARY KEY("username","meeting_id"),
	CONSTRAINT "guests_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meeting_dates" (
	"id" uuid DEFAULT gen_random_uuid(),
	"meeting_id" uuid,
	"date" timestamp NOT NULL,
	CONSTRAINT "meeting_dates_id_date_pk" PRIMARY KEY("id","date"),
	CONSTRAINT "meeting_dates_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location" text,
	"scheduled" boolean,
	"from_time" char(5) NOT NULL,
	"to_time" char(5) NOT NULL,
	"group_id" uuid,
	"host_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members_in_meeting" (
	"member_id" text NOT NULL,
	"meeting_id" uuid NOT NULL,
	"availability" "attendance",
	CONSTRAINT "members_in_meeting_member_id_meeting_id_pk" PRIMARY KEY("member_id","meeting_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_accounts" (
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"provider_user_id" text NOT NULL,
	CONSTRAINT "oauth_accounts_provider_id_provider_user_id_pk" PRIMARY KEY("provider_id","provider_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"displayName" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"created_at" timestamp,
	"auth_methods" json NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_in_group" (
	"user_id" text NOT NULL,
	"group_id" uuid NOT NULL,
	CONSTRAINT "users_in_group_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_meeting_day_meeting_dates_id_fk" FOREIGN KEY ("meeting_day") REFERENCES "meeting_dates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups" ADD CONSTRAINT "groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guests" ADD CONSTRAINT "guests_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting_dates" ADD CONSTRAINT "meeting_dates_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meetings" ADD CONSTRAINT "meetings_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meetings" ADD CONSTRAINT "meetings_host_id_members_id_fk" FOREIGN KEY ("host_id") REFERENCES "members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members_in_meeting" ADD CONSTRAINT "members_in_meeting_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members_in_meeting" ADD CONSTRAINT "members_in_meeting_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_in_group" ADD CONSTRAINT "users_in_group_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_in_group" ADD CONSTRAINT "users_in_group_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx_sessions" ON "sessions" ("user_id");