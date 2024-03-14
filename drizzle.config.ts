import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config();

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  driver: "pg",
  dbCredentials: {
    // @ts-expect-error DATABASE_URL should be in the .env
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
