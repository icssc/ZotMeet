import { ExpoSQLiteSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { SQLiteSyncDialect } from "../sqlite-core/dialect.js";

//#region src/expo-sqlite/driver.ts
var ExpoSQLiteDatabase = class extends BaseSQLiteDatabase {
	static [entityKind] = "ExpoSQLiteDatabase";
};
function drizzle(client, config = {}) {
	const dialect = new SQLiteSyncDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	let schema;
	if (config.schema) {
		const tablesConfig = V1.extractTablesRelationalConfig(config.schema, V1.createTableRelationsHelpers);
		schema = {
			fullSchema: config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap
		};
	}
	const relations = config.relations ?? {};
	const db = new ExpoSQLiteDatabase("sync", dialect, new ExpoSQLiteSession(client, dialect, relations, schema, { logger }), relations, schema);
	db.$client = client;
	return db;
}

//#endregion
export { ExpoSQLiteDatabase, drizzle };
//# sourceMappingURL=driver.js.map