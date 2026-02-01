const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_better_sqlite3_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __sqlite_core_db_ts = require("../sqlite-core/db.cjs");
let __sqlite_core_dialect_ts = require("../sqlite-core/dialect.cjs");
let better_sqlite3 = require("better-sqlite3");
better_sqlite3 = require_rolldown_runtime.__toESM(better_sqlite3);

//#region src/better-sqlite3/driver.ts
var BetterSQLite3Database = class extends __sqlite_core_db_ts.BaseSQLiteDatabase {
	static [__entity_ts.entityKind] = "BetterSQLite3Database";
};
function construct(client, config = {}) {
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
	const db = new BetterSQLite3Database("sync", dialect, new require_better_sqlite3_session.BetterSQLiteSession(client, dialect, relations, schema, { logger }), relations, schema);
	db.$client = client;
	return db;
}
function drizzle(...params) {
	if (params[0] === void 0 || typeof params[0] === "string") return construct(params[0] === void 0 ? new better_sqlite3.default() : new better_sqlite3.default(params[0]), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	if (typeof connection === "object") {
		const { source, ...options } = connection;
		return construct(new better_sqlite3.default(source, options), drizzleConfig);
	}
	return construct(new better_sqlite3.default(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.BetterSQLite3Database = BetterSQLite3Database;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map