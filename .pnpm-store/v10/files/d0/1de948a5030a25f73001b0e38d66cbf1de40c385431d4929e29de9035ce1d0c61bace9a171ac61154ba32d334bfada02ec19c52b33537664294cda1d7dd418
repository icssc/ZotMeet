const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_sql_js_session = require('./session.cjs');
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __sqlite_core_db_ts = require("../sqlite-core/db.cjs");
let __sqlite_core_dialect_ts = require("../sqlite-core/dialect.cjs");

//#region src/sql-js/driver.ts
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
	return new __sqlite_core_db_ts.BaseSQLiteDatabase("sync", dialect, new require_sql_js_session.SQLJsSession(client, dialect, relations, schema, { logger }), relations, schema);
}

//#endregion
exports.drizzle = drizzle;
//# sourceMappingURL=driver.cjs.map