import { SQLiteRemoteSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { SQLiteAsyncDialect } from "../sqlite-core/dialect.js";

//#region src/sqlite-proxy/driver.ts
var SqliteRemoteDatabase = class extends BaseSQLiteDatabase {
	static [entityKind] = "SqliteRemoteDatabase";
	async batch(batch) {
		return this.session.batch(batch);
	}
};
function drizzle(callback, batchCallback, config) {
	const dialect = new SQLiteAsyncDialect({ casing: config?.casing });
	let logger;
	let cache;
	let _batchCallback;
	let _config = {};
	if (batchCallback) {
		if (typeof batchCallback === "function") {
			_batchCallback = batchCallback;
			_config = config ?? {};
		} else {
			_batchCallback = void 0;
			_config = batchCallback;
		}
		if (_config.logger === true) logger = new DefaultLogger();
		else if (_config.logger !== false) {
			logger = _config.logger;
			cache = _config.cache;
		}
	}
	let schema;
	if (_config.schema) {
		const tablesConfig = V1.extractTablesRelationalConfig(_config.schema, V1.createTableRelationsHelpers);
		schema = {
			fullSchema: _config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap
		};
	}
	const relations = _config.relations ?? {};
	const db = new SqliteRemoteDatabase("async", dialect, new SQLiteRemoteSession(callback, dialect, relations, schema, _batchCallback, {
		logger,
		cache
	}), relations, schema, true);
	db.$cache = cache;
	if (db.$cache) db.$cache["invalidate"] = cache?.onMutate;
	return db;
}

//#endregion
export { SqliteRemoteDatabase, drizzle };
//# sourceMappingURL=driver.js.map