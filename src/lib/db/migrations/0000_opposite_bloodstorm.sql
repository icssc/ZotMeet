CREATE SCHEMA "zotmeet";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zotmeet"."availabilities" (
	"day" date NOT NULL,
	"user_id" text NOT NULL,
	"block_length" smallint DEFAULT 15 NOT NULL,
	"meeting_id" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"earliest_time" numeric,
	"latest_time" numeric,
	"availability_string" text NOT NULL,
	CONSTRAINT "availabilities_user_id_day_meeting_id_pk" PRIMARY KEY("user_id","day","meeting_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zotmeet"."groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zotmeet"."meetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"date" timestamp NOT NULL,
	"description" text,
	"location" text,
	"from_time" timestamp NOT NULL,
	"to_time" timestamp NOT NULL,
	"group_id" uuid,
	"host_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zotmeet"."sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zotmeet"."users_in_group" (
	"user_id" text NOT NULL,
	"group_id" uuid NOT NULL,
	CONSTRAINT "users_in_group_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zotmeet"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"displayName" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp,
	CONSTRAINT "user_displayName_unique" UNIQUE("displayName"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx_sessions" ON "zotmeet"."sessions" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zotmeet"."availabilities" ADD CONSTRAINT "availabilities_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zotmeet"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zotmeet"."availabilities" ADD CONSTRAINT "availabilities_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "zotmeet"."meetings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zotmeet"."meetings" ADD CONSTRAINT "meetings_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "zotmeet"."groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zotmeet"."meetings" ADD CONSTRAINT "meetings_host_id_user_id_fk" FOREIGN KEY ("host_id") REFERENCES "zotmeet"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zotmeet"."sessions" ADD CONSTRAINT "sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zotmeet"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zotmeet"."users_in_group" ADD CONSTRAINT "users_in_group_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zotmeet"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zotmeet"."users_in_group" ADD CONSTRAINT "users_in_group_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "zotmeet"."groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
