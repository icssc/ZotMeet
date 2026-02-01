import { SQLJsSession } from "./session.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { SQLiteSyncDialect } from "../sqlite-core/dialect.js";

//#region src/sql-js/driver.ts
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
	return new BaseSQLiteDatabase("sync", dialect, new SQLJsSession(client, dialect, relations, schema, { logger }), relations, schema);
}

//#endregion
export { drizzle };
//# sourceMappingURL=driver.js.map