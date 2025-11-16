DO $$ BEGIN
    ALTER TABLE "meetings" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;