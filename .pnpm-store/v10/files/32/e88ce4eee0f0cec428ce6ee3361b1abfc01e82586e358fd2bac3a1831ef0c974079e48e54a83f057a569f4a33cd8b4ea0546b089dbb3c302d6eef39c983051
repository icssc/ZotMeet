import { PgRemoteSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { PgDialect } from "../pg-core/dialect.js";

//#region src/pg-proxy/driver.ts
var PgRemoteDatabase = class extends PgAsyncDatabase {
	static [entityKind] = "PgRemoteDatabase";
};
function drizzle(callback, config = {}, _dialect = () => new PgDialect({ casing: config.casing })) {
	const dialect = _dialect();
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
	const db = new PgRemoteDatabase(dialect, new PgRemoteSession(callback, dialect, relations, schema, {
		logger,
		cache: config.cache
	}), relations, schema);
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}

//#endregion
export { PgRemoteDatabase, drizzle };
//# sourceMappingURL=driver.js.map