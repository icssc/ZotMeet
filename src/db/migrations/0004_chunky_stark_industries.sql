ALTER TABLE "notifications" DROP CONSTRAINT "notifications_created_by_members_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "created_by" SET DATA TYPE text;