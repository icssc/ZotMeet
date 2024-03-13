ALTER TABLE "zotmeet"."user" RENAME COLUMN "username" TO "displayName";--> statement-breakpoint
ALTER TABLE "zotmeet"."user" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "zotmeet"."user" ADD CONSTRAINT "user_displayName_unique" UNIQUE("displayName");