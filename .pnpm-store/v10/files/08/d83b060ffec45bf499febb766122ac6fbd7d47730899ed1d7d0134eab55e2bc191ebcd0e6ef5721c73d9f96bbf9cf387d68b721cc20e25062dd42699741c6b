import { SingleStoreRemoteSession } from "./session.js";
import { entityKind } from "../entity.js";
import { createTableRelationsHelpers, extractTablesRelationalConfig } from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { SingleStoreDatabase } from "../singlestore-core/db.js";
import { SingleStoreDialect } from "../singlestore-core/dialect.js";

//#region src/singlestore-proxy/driver.ts
var SingleStoreRemoteDatabase = class extends SingleStoreDatabase {
	static [entityKind] = "SingleStoreRemoteDatabase";
};
function drizzle(callback, config = {}) {
	const dialect = new SingleStoreDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	let schema;
	if (config.schema) {
		const tablesConfig = extractTablesRelationalConfig(config.schema, createTableRelationsHelpers);
		schema = {
			fullSchema: config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap
		};
	}
	const relations = config.relations ?? {};
	return new SingleStoreRemoteDatabase(dialect, new SingleStoreRemoteSession(callback, dialect, relations, schema, { logger }), relations, schema);
}

//#endregion
export { SingleStoreRemoteDatabase, drizzle };
//# sourceMappingURL=driver.js.map