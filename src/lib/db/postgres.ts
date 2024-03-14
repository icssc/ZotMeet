import postgres from "postgres";

import { DATABASE_URL } from "$env/static/private";

/**
 * The PostgreSQL client. Lucia v2 does not have a Drizzle connector (v3 does),
 * so you will have to use this instead of the Drizzle client.
 *
 * In all other cases, you should probably not use this unless you know what you are doing.
 */
export const client = postgres(DATABASE_URL, { max: 1, ssl: "prefer" });
