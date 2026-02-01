const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_d1_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __sqlite_core_db_ts = require("../sqlite-core/db.cjs");
let __sqlite_core_dialect_ts = require("../sqlite-core/dialect.cjs");

//#region src/d1/driver.ts
var DrizzleD1Database = class extends __sqlite_core_db_ts.BaseSQLiteDatabase {
	static [__entity_ts.entityKind] = "D1Database";
	async batch(batch) {
		return this.session.batch(batch);
	}
};
function drizzle(client, config = {}) {
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
	const db = new DrizzleD1Database("async", dialect, new require_d1_session.SQLiteD1Session(client, dialect, relations, schema, {
		logger,
		cache: config.cache
	}), relations, schema, void 0, true);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}

//#endregion
exports.DrizzleD1Database = DrizzleD1Database;
exports.drizzle = drizzle;
//# sourceMappingURL=driver.cjs.map