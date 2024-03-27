import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const DATABASE_URL = process.env["DATABASE_URL"];
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL not found. Please ensure you have the DATABASE_URL variable defined inside of your environment configuration.",
  );
}
const migrationClient = postgres(DATABASE_URL, { max: 1, ssl: "prefer" });
const db = drizzle(migrationClient);

await migrate(db, { migrationsFolder: "src/lib/db/migrations" });
await migrationClient.end();
