const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __sql_sql_ts = require("../sql/sql.cjs");
let __migrator_ts = require("../migrator.cjs");

//#region src/singlestore-proxy/migrator.ts
async function migrate(db, callback, config) {
	const migrations = (0, __migrator_ts.readMigrationFiles)(config);
	const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
	const migrationTableCreate = __sql_sql_ts.sql`
		create table if not exists ${__sql_sql_ts.sql.identifier(migrationsTable)} (
			id serial primary key,
			hash text not null,
			created_at bigint
		)
	`;
	await db.execute(migrationTableCreate);
	const dbMigrations = await db.select({
		id: __sql_sql_ts.sql.raw("id"),
		hash: __sql_sql_ts.sql.raw("hash"),
		created_at: __sql_sql_ts.sql.raw("created_at")
	}).from(__sql_sql_ts.sql.identifier(migrationsTable).getSQL()).orderBy(__sql_sql_ts.sql.raw("created_at desc")).limit(1);
	if (typeof config === "object" && config.init) {
		if (dbMigrations.length) return { exitCode: "databaseMigrations" };
		if (migrations.length > 1) return { exitCode: "localMigrations" };
		const [migration] = migrations;
		if (!migration) return;
		await callback([db.dialect.sqlToQuery(__sql_sql_ts.sql`insert into ${__sql_sql_ts.sql.identifier(migrationsTable)} (\`hash\`, \`created_at\`) values(${migration.hash}, '${migration.folderMillis}')`.inlineParams()).sql]);
		return;
	}
	const lastDbMigration = dbMigrations[0];
	const queriesToRun = [];
	for (const migration of migrations) if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) queriesToRun.push(...migration.sql, db.dialect.sqlToQuery(__sql_sql_ts.sql`insert into ${__sql_sql_ts.sql.identifier(migrationsTable)} (\`hash\`, \`created_at\`) values(${migration.hash}, '${migration.folderMillis}')`.inlineParams()).sql);
	await callback(queriesToRun);
}

//#endregion
exports.migrate = migrate;
//# sourceMappingURL=migrator.cjs.map