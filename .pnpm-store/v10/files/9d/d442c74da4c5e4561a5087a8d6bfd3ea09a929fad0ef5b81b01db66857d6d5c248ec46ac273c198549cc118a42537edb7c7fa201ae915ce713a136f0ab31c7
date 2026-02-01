const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_pg_proxy_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __pg_core_async_db_ts = require("../pg-core/async/db.cjs");
let __pg_core_dialect_ts = require("../pg-core/dialect.cjs");

//#region src/pg-proxy/driver.ts
var PgRemoteDatabase = class extends __pg_core_async_db_ts.PgAsyncDatabase {
	static [__entity_ts.entityKind] = "PgRemoteDatabase";
};
function drizzle(callback, config = {}, _dialect = () => new __pg_core_dialect_ts.PgDialect({ casing: config.casing })) {
	const dialect = _dialect();
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
	const db = new PgRemoteDatabase(dialect, new require_pg_proxy_session.PgRemoteSession(callback, dialect, relations, schema, {
		logger,
		cache: config.cache
	}), relations, schema);
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}

//#endregion
exports.PgRemoteDatabase = PgRemoteDatabase;
exports.drizzle = drizzle;
//# sourceMappingURL=driver.cjs.map