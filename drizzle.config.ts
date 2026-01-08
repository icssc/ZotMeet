import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: Some operations don't require the DB url. Suppressing this rule rather than using ts ignore on the whole config.
		url: process.env.DATABASE_URL!,
	},
});
