const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __sql_sql_ts = require("../sql/sql.cjs");
let __migrator_ts = require("../migrator.cjs");

//#region src/libsql/migrator.ts
async function migrate(db, config) {
	const migrations = (0, __migrator_ts.readMigrationFiles)(config);
	const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
	const migrationTableCreate = __sql_sql_ts.sql`
		CREATE TABLE IF NOT EXISTS ${__sql_sql_ts.sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
	await db.session.run(migrationTableCreate);
	const dbMigrations = await db.values(__sql_sql_ts.sql`SELECT id, hash, created_at FROM ${__sql_sql_ts.sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`);
	if (config.init) {
		if (dbMigrations.length) return { exitCode: "databaseMigrations" };
		if (migrations.length > 1) return { exitCode: "localMigrations" };
		const [migration] = migrations;
		if (!migration) return;
		await db.run(__sql_sql_ts.sql`insert into ${__sql_sql_ts.sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`);
		return;
	}
	const lastDbMigration = dbMigrations[0] ?? void 0;
	const statementToBatch = [];
	for (const migration of migrations) if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
		for (const stmt of migration.sql) statementToBatch.push(db.run(__sql_sql_ts.sql.raw(stmt)));
		statementToBatch.push(db.run(__sql_sql_ts.sql`INSERT INTO ${__sql_sql_ts.sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`));
	}
	await db.session.migrate(statementToBatch);
}

//#endregion
exports.migrate = migrate;
//# sourceMappingURL=migrator.cjs.map