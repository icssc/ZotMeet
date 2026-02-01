const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_mysql_proxy_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __mysql_core_db_ts = require("../mysql-core/db.cjs");
let __mysql_core_dialect_ts = require("../mysql-core/dialect.cjs");

//#region src/mysql-proxy/driver.ts
var MySqlRemoteDatabase = class extends __mysql_core_db_ts.MySqlDatabase {
	static [__entity_ts.entityKind] = "MySqlRemoteDatabase";
};
function drizzle(callback, config = {}, _dialect = () => new __mysql_core_dialect_ts.MySqlDialect({ casing: config.casing })) {
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
	return new MySqlRemoteDatabase(dialect, new require_mysql_proxy_session.MySqlRemoteSession(callback, dialect, relations, schema, { logger }), relations, schema, "default");
}

//#endregion
exports.MySqlRemoteDatabase = MySqlRemoteDatabase;
exports.drizzle = drizzle;
//# sourceMappingURL=driver.cjs.map