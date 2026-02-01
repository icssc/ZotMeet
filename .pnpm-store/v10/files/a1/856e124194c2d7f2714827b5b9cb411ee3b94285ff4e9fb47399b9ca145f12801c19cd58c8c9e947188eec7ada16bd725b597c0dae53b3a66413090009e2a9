import { sql } from "../sql/sql.js";
import { readMigrationFiles } from "../migrator.js";

//#region src/sqlite-proxy/migrator.ts
async function migrate(db, callback, config) {
	const migrations = readMigrationFiles(config);
	const migrationsTable = typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
	const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
	await db.run(migrationTableCreate);
	const dbMigrations = await db.values(sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`);
	if (typeof config === "object" && config.init) {
		if (dbMigrations.length) return { exitCode: "databaseMigrations" };
		if (migrations.length > 1) return { exitCode: "localMigrations" };
		const [migration] = migrations;
		if (!migration) return;
		await callback([db.dialect.sqlToQuery(sql`insert into ${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`.inlineParams()).sql]);
		return;
	}
	const lastDbMigration = dbMigrations[0] ?? void 0;
	const queriesToRun = [];
	for (const migration of migrations) if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) queriesToRun.push(...migration.sql, db.dialect.sqlToQuery(sql`insert into ${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`.inlineParams()).sql);
	await callback(queriesToRun);
}

//#endregion
export { migrate };
//# sourceMappingURL=migrator.js.map