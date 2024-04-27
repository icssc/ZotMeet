-- This file is used to control access to the database.
-- You probably do not need to modify this.

CREATE ROLE zotmeet_migrations LOGIN;
CREATE ROLE zotmeet_prod LOGIN;
CREATE ROLE zotmeet_staging LOGIN;

GRANT ALL ON DATABASE zotmeet TO zotmeet_migrations;
GRANT ALL ON DATABASE zotmeet TO zotmeet_prod;
GRANT ALL ON DATABASE zotmeet TO zotmeet_staging;

GRANT ALL ON SCHEMA drizzle TO zotmeet_migrations;
GRANT ALL ON SCHEMA public TO zotmeet_migrations;
GRANT ALL ON SCHEMA dev TO zotmeet_migrations;
GRANT ALL ON SCHEMA public TO zotmeet_prod;
GRANT ALL ON SCHEMA dev TO zotmeet_staging;

GRANT ALL ON ALL TABLES IN SCHEMA public TO zotmeet_migrations;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO zotmeet_migrations;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO zotmeet_migrations;
GRANT ALL ON ALL TABLES IN SCHEMA dev TO zotmeet_migrations;
GRANT ALL ON ALL SEQUENCES IN SCHEMA dev TO zotmeet_migrations;
GRANT ALL ON ALL ROUTINES IN SCHEMA dev TO zotmeet_migrations;
GRANT ALL ON ALL TABLES IN SCHEMA public TO zotmeet_prod;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO zotmeet_prod;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO zotmeet_prod;
GRANT ALL ON ALL TABLES IN SCHEMA dev TO zotmeet_staging;
GRANT ALL ON ALL SEQUENCES IN SCHEMA dev TO zotmeet_staging;
GRANT ALL ON ALL ROUTINES IN SCHEMA dev TO zotmeet_staging;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO zotmeet_prod;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO zotmeet_prod;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO zotmeet_prod;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TYPES TO zotmeet_prod;
ALTER DEFAULT PRIVILEGES IN SCHEMA dev GRANT ALL ON TABLES TO zotmeet_staging;
ALTER DEFAULT PRIVILEGES IN SCHEMA dev GRANT ALL ON SEQUENCES TO zotmeet_staging;
ALTER DEFAULT PRIVILEGES IN SCHEMA dev GRANT ALL ON ROUTINES TO zotmeet_staging;
ALTER DEFAULT PRIVILEGES IN SCHEMA dev GRANT ALL ON TYPES TO zotmeet_staging;
