import { drizzle } from "drizzle-orm/postgres-js";

import { client } from "$lib/db/postgres";
import * as schema from "$lib/db/schema";

// The Drizzle client. You should almost always be using this to make queries since it's type-safe.
export const db = drizzle(client, { schema });
