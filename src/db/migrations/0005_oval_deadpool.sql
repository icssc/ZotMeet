ALTER TABLE
    "members" DROP CONSTRAINT IF EXISTS "members_id_unique";

--> statement-breakpoint
ALTER TABLE
    "availabilities" DROP CONSTRAINT IF EXISTS "availabilities_member_id_members_id_fk";

--> statement-breakpoint
ALTER TABLE
    "meetings" DROP CONSTRAINT IF EXISTS "meetings_host_id_members_id_fk";

--> statement-breakpoint
ALTER TABLE
    "users" DROP CONSTRAINT IF EXISTS "users_id_members_id_fk";

--> statement-breakpoint
ALTER TABLE
    "users" DROP CONSTRAINT IF EXISTS "users_member_id_members_id_fk";

--> statement-breakpoint
ALTER TABLE
    "availabilities" DROP CONSTRAINT IF EXISTS "availabilities_member_id_meeting_id_pk";

--> statement-breakpoint
ALTER TABLE
    "availabilities" DROP COLUMN IF EXISTS "member_id";

--> statement-breakpoint
ALTER TABLE
    "meetings" DROP COLUMN IF EXISTS "host_id";

--> statement-breakpoint
ALTER TABLE
    "members" DROP COLUMN IF EXISTS "id";

--> statement-breakpoint
ALTER TABLE
    "users" DROP COLUMN IF EXISTS "member_id";