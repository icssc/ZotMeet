DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'groups' 
        AND column_name = 'archived'
    ) THEN
        ALTER TABLE "groups" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;
    END IF;
END $$;