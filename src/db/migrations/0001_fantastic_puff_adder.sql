DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meetings' AND column_name = 'archived') THEN
    ALTER TABLE "meetings" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;
  END IF;
END $$;