const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __sql_sql_ts = require("../sql/sql.cjs");
let __migrator_ts = require("../migrator.cjs");

//#region src/sqlite-proxy/migrator.ts
async function migrate(db, callback, config) {
	const migrations = (0, __migrator_ts.readMigrationFiles)(config);
	const migrationsTable = typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
	const migrationTableCreate = __sql_sql_ts.sql`
		CREATE TABLE IF NOT EXISTS ${__sql_sql_ts.sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
	await db.run(migrationTableCreate);
	const dbMigrations = await db.values(__sql_sql_ts.sql`SELECT id, hash, created_at FROM ${__sql_sql_ts.sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`);
	if (typeof config === "object" && config.init) {
		if (dbMigrations.length) return { exitCode: "databaseMigrations" };
		if (migrations.length > 1) return { exitCode: "localMigrations" };
		const [migration] = migrations;
		if (!migration) return;
		await callback([db.dialect.sqlToQuery(__sql_sql_ts.sql`insert into ${__sql_sql_ts.sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`.inlineParams()).sql]);
		return;
	}
	const lastDbMigration = dbMigrations[0] ?? void 0;
	const queriesToRun = [];
	for (const migration of migrations) if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) queriesToRun.push(...migration.sql, db.dialect.sqlToQuery(__sql_sql_ts.sql`insert into ${__sql_sql_ts.sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`.inlineParams()).sql);
	await callback(queriesToRun);
}

//#endregion
exports.migrate = migrate;
//# sourceMappingURL=migrator.cjs.map