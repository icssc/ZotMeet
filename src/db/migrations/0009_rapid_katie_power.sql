CREATE TABLE IF NOT EXISTS "user_google_calendars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"calendar_id" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_google_calendars" ADD CONSTRAINT "user_google_calendars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_google_calendars_user_id_idx" ON "user_google_calendars" USING btree ("user_id");
--> statement-breakpoint
ALTER TABLE "user_google_calendars" ADD CONSTRAINT "user_calendar_unique" UNIQUE("user_id","calendar_id");
