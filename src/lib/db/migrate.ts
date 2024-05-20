import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const MIGRATION_DB_URL = process.env["MIGRATION_DB_URL"];
if (!MIGRATION_DB_URL) {
  throw new Error(
    "MIGRATION_DB_URL not found. Please ensure you have the MIGRATION_DB_URL variable defined inside of your environment configuration.",
  );
}

const isProd = process.env["STAGE"] === "prod";
console.log(`Running migrations in ${isProd ? "production" : "development"} mode.`);

const migrationConnectionString = `${MIGRATION_DB_URL}${isProd ? "" : "?search_path=dev"}`;
const migrationClient = postgres(migrationConnectionString, { max: 1, ssl: "prefer" });
const db = drizzle(migrationClient);

await migrate(db, {
  migrationsFolder: "src/lib/db/migrations",
  migrationsTable: process.env["STAGE"] === "prod" ? "public_migrations" : "dev_migrations",
});
await migrationClient.end();
