import { sql } from "../sql/sql.js";
import { readMigrationFiles } from "../migrator.js";

//#region src/sqlite-cloud/migrator.ts
async function migrate(db, config) {
	const migrations = readMigrationFiles(config);
	const { session } = db;
	const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
	const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
			id INTEGER PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
	await session.run(migrationTableCreate);
	const dbMigrations = await session.values(sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`);
	if (typeof config === "object" && config.init) {
		if (dbMigrations.length) return { exitCode: "databaseMigrations" };
		if (migrations.length > 1) return { exitCode: "localMigrations" };
		const [migration] = migrations;
		if (!migration) return;
		await session.run(sql`insert into ${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`);
		return;
	}
	const lastDbMigration = dbMigrations[0] ?? void 0;
	await session.run(sql`BEGIN TRANSACTION`);
	try {
		const stmts = sql.join(migrations.reduce((statements, migration) => {
			if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) statements.push(sql.raw(migration.sql.join("")), sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis});\n`);
			return statements;
		}, []));
		await session.run(stmts);
		await session.run(sql`COMMIT`);
	} catch (error) {
		await session.run(sql`ROLLBACK`);
		throw error;
	}
}

//#endregion
export { migrate };
//# sourceMappingURL=migrator.js.map