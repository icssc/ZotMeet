CREATE TABLE IF NOT EXISTS "foo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	CONSTRAINT "foo_id_unique" UNIQUE("id")
);
