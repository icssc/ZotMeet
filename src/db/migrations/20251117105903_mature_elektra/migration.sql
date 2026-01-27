ALTER TABLE "sessions" ADD COLUMN "oidc_access_token" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "oidc_refresh_token" text;