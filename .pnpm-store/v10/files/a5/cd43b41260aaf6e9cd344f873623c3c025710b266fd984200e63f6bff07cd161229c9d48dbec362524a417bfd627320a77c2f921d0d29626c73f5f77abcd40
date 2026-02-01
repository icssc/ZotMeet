import { sql } from "../sql/sql.js";
import { readMigrationFiles } from "../migrator.js";

//#region src/singlestore-proxy/migrator.ts
async function migrate(db, callback, config) {
	const migrations = readMigrationFiles(config);
	const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
	const migrationTableCreate = sql`
		create table if not exists ${sql.identifier(migrationsTable)} (
			id serial primary key,
			hash text not null,
			created_at bigint
		)
	`;
	await db.execute(migrationTableCreate);
	const dbMigrations = await db.select({
		id: sql.raw("id"),
		hash: sql.raw("hash"),
		created_at: sql.raw("created_at")
	}).from(sql.identifier(migrationsTable).getSQL()).orderBy(sql.raw("created_at desc")).limit(1);
	if (typeof config === "object" && config.init) {
		if (dbMigrations.length) return { exitCode: "databaseMigrations" };
		if (migrations.length > 1) return { exitCode: "localMigrations" };
		const [migration] = migrations;
		if (!migration) return;
		await callback([db.dialect.sqlToQuery(sql`insert into ${sql.identifier(migrationsTable)} (\`hash\`, \`created_at\`) values(${migration.hash}, '${migration.folderMillis}')`.inlineParams()).sql]);
		return;
	}
	const lastDbMigration = dbMigrations[0];
	const queriesToRun = [];
	for (const migration of migrations) if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) queriesToRun.push(...migration.sql, db.dialect.sqlToQuery(sql`insert into ${sql.identifier(migrationsTable)} (\`hash\`, \`created_at\`) values(${migration.hash}, '${migration.folderMillis}')`.inlineParams()).sql);
	await callback(queriesToRun);
}

//#endregion
export { migrate };
//# sourceMappingURL=migrator.js.map