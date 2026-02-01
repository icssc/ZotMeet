import { LibSQLSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { SQLiteAsyncDialect } from "../sqlite-core/dialect.js";

//#region src/libsql/driver-core.ts
var LibSQLDatabase = class extends BaseSQLiteDatabase {
	static [entityKind] = "LibSQLDatabase";
	async batch(batch) {
		return this.session.batch(batch);
	}
};
/** @internal */
function construct(client, config = {}) {
	const dialect = new SQLiteAsyncDialect({ casing: config.casing });
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
	const db = new LibSQLDatabase("async", dialect, new LibSQLSession(client, dialect, relations, schema, {
		logger,
		cache: config.cache
	}, void 0), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}

//#endregion
export { LibSQLDatabase, construct };
//# sourceMappingURL=driver-core.js.map