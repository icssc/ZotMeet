const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_sqlite_cloud_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __sqlite_core_db_ts = require("../sqlite-core/db.cjs");
let __sqlite_core_dialect_ts = require("../sqlite-core/dialect.cjs");
let _sqlitecloud_drivers = require("@sqlitecloud/drivers");

//#region src/sqlite-cloud/driver.ts
var SQLiteCloudDatabase = class extends __sqlite_core_db_ts.BaseSQLiteDatabase {
	static [__entity_ts.entityKind] = "SQLiteCloudDatabase";
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
	const db = new SQLiteCloudDatabase("async", dialect, new require_sqlite_cloud_session.SQLiteCloudSession(client, dialect, relations, schema, {
		logger,
		cache: config.cache
	}), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct(new _sqlitecloud_drivers.Database(params[0]), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	return construct(typeof connection === "string" ? new _sqlitecloud_drivers.Database(connection) : new _sqlitecloud_drivers.Database(connection.path, connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.SQLiteCloudDatabase = SQLiteCloudDatabase;
exports.construct = construct;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map