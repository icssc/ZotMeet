import { sql } from "../sql/sql.js";
import { readMigrationFiles } from "../migrator.js";

//#region src/pg-proxy/migrator.ts
async function migrate(db, callback, config) {
	const migrations = readMigrationFiles(config);
	const migrationsTable = typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
	const migrationsSchema = typeof config === "string" ? "drizzle" : config.migrationsSchema ?? "drizzle";
	const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at bigint
		)
	`;
	await db.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(migrationsSchema)}`);
	await db.execute(migrationTableCreate);
	const dbMigrations = await db.execute(sql`select id, hash, created_at from ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} order by created_at desc limit 1`);
	if (typeof config === "object" && config.init) {
		if (dbMigrations.length) return { exitCode: "databaseMigrations" };
		if (migrations.length > 1) return { exitCode: "localMigrations" };
		const [migration] = migrations;
		if (!migration) return;
		await callback([db.dialect.sqlToQuery(sql`insert into ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`.inlineParams()).sql]);
		return;
	}
	const lastDbMigration = dbMigrations[0] ?? void 0;
	const queriesToRun = [];
	for (const migration of migrations) if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) queriesToRun.push(...migration.sql, db.dialect.sqlToQuery(sql`insert into ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, '${migration.folderMillis}')`.inlineParams()).sql);
	await callback(queriesToRun);
}

//#endregion
export { migrate };
//# sourceMappingURL=migrator.js.map