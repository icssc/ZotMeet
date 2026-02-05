#!/usr/bin/env tsx
/**
 * Script to directly add the archived column to the groups table.
 * This bypasses Drizzle's migration system.
 *
 * Usage: npx tsx scripts/add-archived-column-direct.ts
 */

import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
	throw new Error("Missing DATABASE_URL env var.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addArchivedColumn() {
	const client = await pool.connect();

	try {
		console.log("Checking if 'archived' column exists in 'groups' table...");

		// Check if column exists
		const checkResult = await client.query(`
			SELECT column_name 
			FROM information_schema.columns 
			WHERE table_schema = 'public'
			AND table_name = 'groups' 
			AND column_name = 'archived'
		`);

		if (checkResult.rows.length > 0) {
			console.log("✅ Column 'archived' already exists in 'groups' table.");
			return;
		}

		console.log("❌ Column 'archived' does NOT exist. Adding it now...");

		// Add the column directly
		await client.query(`
			ALTER TABLE "public"."groups" 
			ADD COLUMN "archived" boolean DEFAULT false NOT NULL
		`);

		console.log("✅ Successfully added 'archived' column to 'groups' table.");

		// Verify it was added
		const verifyResult = await client.query(`
			SELECT column_name, data_type, column_default, is_nullable
			FROM information_schema.columns 
			WHERE table_schema = 'public'
			AND table_name = 'groups' 
			AND column_name = 'archived'
		`);

		if (verifyResult.rows.length > 0) {
			console.log(
				"✅ Verification successful. Column details:",
				verifyResult.rows[0],
			);
		} else {
			console.log("⚠️  Warning: Column was added but verification failed.");
		}
	} catch (error) {
		console.error("❌ Error:", error);
		throw error;
	} finally {
		client.release();
		await pool.end();
	}
}

addArchivedColumn()
	.then(() => {
		console.log("\n✅ Script completed successfully.");
		console.log(
			"💡 Next step: Fix the _journal.json file so future migrations work.",
		);
		process.exit(0);
	})
	.catch((error) => {
		console.error("\n❌ Script failed:", error);
		process.exit(1);
	});
