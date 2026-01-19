ALTER TABLE "group_invites" DROP CONSTRAINT "group_invites_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_invites" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "group_invites" DROP COLUMN IF EXISTS "user_id";