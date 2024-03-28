import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config();

const { DATABASE_URL } = process.env;
  
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL not found. Please ensure you have the DATABASE_URL variable defined inside of your environment configuration.",
  );
}

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db",
  driver: "pg",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
} satisfies Config;
