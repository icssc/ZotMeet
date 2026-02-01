const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_libsql_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __sqlite_core_db_ts = require("../sqlite-core/db.cjs");
let __sqlite_core_dialect_ts = require("../sqlite-core/dialect.cjs");

//#region src/libsql/driver-core.ts
var LibSQLDatabase = class extends __sqlite_core_db_ts.BaseSQLiteDatabase {
	static [__entity_ts.entityKind] = "LibSQLDatabase";
	async batch(batch) {
		return this.session.batch(batch);
	}
};
/** @internal */
function construct(client, config = {}) {
	const dialect = new __sqlite_core_dialect_ts.SQLiteAsyncDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) logger = new __logger_ts.DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	let schema;
	if (config.schema) {
		const tablesConfig = ___relations_ts.extractTablesRelationalConfig(config.schema, ___relations_ts.createTableRelationsHelpers);
		schema = {
			fullSchema: config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap
		};
	}
	const relations = config.relations ?? {};
	const db = new LibSQLDatabase("async", dialect, new require_libsql_session.LibSQLSession(client, dialect, relations, schema, {
		logger,
		cache: config.cache
	}, void 0), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}

//#endregion
exports.LibSQLDatabase = LibSQLDatabase;
exports.construct = construct;
//# sourceMappingURL=driver-core.cjs.map