const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_sqlite_proxy_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __sqlite_core_db_ts = require("../sqlite-core/db.cjs");
let __sqlite_core_dialect_ts = require("../sqlite-core/dialect.cjs");

//#region src/sqlite-proxy/driver.ts
var SqliteRemoteDatabase = class extends __sqlite_core_db_ts.BaseSQLiteDatabase {
	static [__entity_ts.entityKind] = "SqliteRemoteDatabase";
	async batch(batch) {
		return this.session.batch(batch);
	}
};
function drizzle(callback, batchCallback, config) {
	const dialect = new __sqlite_core_dialect_ts.SQLiteAsyncDialect({ casing: config?.casing });
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
		if (_config.logger === true) logger = new __logger_ts.DefaultLogger();
		else if (_config.logger !== false) {
			logger = _config.logger;
			cache = _config.cache;
		}
	}
	let schema;
	if (_config.schema) {
		const tablesConfig = ___relations_ts.extractTablesRelationalConfig(_config.schema, ___relations_ts.createTableRelationsHelpers);
		schema = {
			fullSchema: _config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap
		};
	}
	const relations = _config.relations ?? {};
	const db = new SqliteRemoteDatabase("async", dialect, new require_sqlite_proxy_session.SQLiteRemoteSession(callback, dialect, relations, schema, _batchCallback, {
		logger,
		cache
	}), relations, schema, true);
	db.$cache = cache;
	if (db.$cache) db.$cache["invalidate"] = cache?.onMutate;
	return db;
}

//#endregion
exports.SqliteRemoteDatabase = SqliteRemoteDatabase;
exports.drizzle = drizzle;
//# sourceMappingURL=driver.cjs.map