const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_durable_sqlite_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __sqlite_core_db_ts = require("../sqlite-core/db.cjs");
let __sqlite_core_dialect_ts = require("../sqlite-core/dialect.cjs");

//#region src/durable-sqlite/driver.ts
var DrizzleSqliteDODatabase = class extends __sqlite_core_db_ts.BaseSQLiteDatabase {
	static [__entity_ts.entityKind] = "DrizzleSqliteDODatabase";
};
function drizzle(client, config = {}) {
	const dialect = new __sqlite_core_dialect_ts.SQLiteSyncDialect({ casing: config.casing });
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
	const db = new DrizzleSqliteDODatabase("sync", dialect, new require_durable_sqlite_session.SQLiteDOSession(client, dialect, relations, schema, { logger }), relations, schema, false, true);
	db.$client = client;
	return db;
}

//#endregion
exports.DrizzleSqliteDODatabase = DrizzleSqliteDODatabase;
exports.drizzle = drizzle;
//# sourceMappingURL=driver.cjs.map