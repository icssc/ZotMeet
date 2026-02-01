import { sql } from "../sql/sql.js";
import { readMigrationFiles } from "../migrator.js";

//#region src/d1/migrator.ts
async function migrate(db, config) {
	const migrations = readMigrationFiles(config);
	const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
	const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
	await db.session.run(migrationTableCreate);
	const dbMigrations = await db.values(sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`);
	if (typeof config === "object" && config.init) {
		if (dbMigrations.length) return { exitCode: "databaseMigrations" };
		if (migrations.length > 1) return { exitCode: "localMigrations" };
		const [migration] = migrations;
		if (!migration) return;
		await db.run(sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, '${migration.folderMillis}')`.inlineParams());
		return;
	}
	const lastDbMigration = dbMigrations[0] ?? void 0;
	const statementToBatch = [];
	for (const migration of migrations) if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
		for (const stmt of migration.sql) statementToBatch.push(db.run(sql.raw(stmt)));
		statementToBatch.push(db.run(sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, '${migration.folderMillis}')`.inlineParams()));
	}
	if (statementToBatch.length > 0) await db.session.batch(statementToBatch);
}

//#endregion
export { migrate };
//# sourceMappingURL=migrator.js.map