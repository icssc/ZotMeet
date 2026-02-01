import { SQLiteDOSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { SQLiteSyncDialect } from "../sqlite-core/dialect.js";

//#region src/durable-sqlite/driver.ts
var DrizzleSqliteDODatabase = class extends BaseSQLiteDatabase {
	static [entityKind] = "DrizzleSqliteDODatabase";
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
	const db = new DrizzleSqliteDODatabase("sync", dialect, new SQLiteDOSession(client, dialect, relations, schema, { logger }), relations, schema, false, true);
	db.$client = client;
	return db;
}

//#endregion
export { DrizzleSqliteDODatabase, drizzle };
//# sourceMappingURL=driver.js.map