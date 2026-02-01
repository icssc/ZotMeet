const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __sql_sql_ts = require("../sql/sql.cjs");
let __migrator_ts = require("../migrator.cjs");

//#region src/sqlite-cloud/migrator.ts
async function migrate(db, config) {
	const migrations = (0, __migrator_ts.readMigrationFiles)(config);
	const { session } = db;
	const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
	const migrationTableCreate = __sql_sql_ts.sql`
		CREATE TABLE IF NOT EXISTS ${__sql_sql_ts.sql.identifier(migrationsTable)} (
			id INTEGER PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
	await session.run(migrationTableCreate);
	const dbMigrations = await session.values(__sql_sql_ts.sql`SELECT id, hash, created_at FROM ${__sql_sql_ts.sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`);
	if (typeof config === "object" && config.init) {
		if (dbMigrations.length) return { exitCode: "databaseMigrations" };
		if (migrations.length > 1) return { exitCode: "localMigrations" };
		const [migration] = migrations;
		if (!migration) return;
		await session.run(__sql_sql_ts.sql`insert into ${__sql_sql_ts.sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`);
		return;
	}
	const lastDbMigration = dbMigrations[0] ?? void 0;
	await session.run(__sql_sql_ts.sql`BEGIN TRANSACTION`);
	try {
		const stmts = __sql_sql_ts.sql.join(migrations.reduce((statements, migration) => {
			if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) statements.push(__sql_sql_ts.sql.raw(migration.sql.join("")), __sql_sql_ts.sql`INSERT INTO ${__sql_sql_ts.sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis});\n`);
			return statements;
		}, []));
		await session.run(stmts);
		await session.run(__sql_sql_ts.sql`COMMIT`);
	} catch (error) {
		await session.run(__sql_sql_ts.sql`ROLLBACK`);
		throw error;
	}
}

//#endregion
exports.migrate = migrate;
//# sourceMappingURL=migrator.cjs.map