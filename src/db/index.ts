import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
	throw new Error("Missing DATABASE_URL env var.");
}

export const db = drizzle(process.env.DATABASE_URL, { schema: schema });
