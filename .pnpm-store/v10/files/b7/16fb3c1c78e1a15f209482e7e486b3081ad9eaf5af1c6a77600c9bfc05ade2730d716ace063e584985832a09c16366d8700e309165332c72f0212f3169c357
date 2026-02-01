const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_bun_sqlite_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __sqlite_core_db_ts = require("../sqlite-core/db.cjs");
let __sqlite_core_dialect_ts = require("../sqlite-core/dialect.cjs");
let bun_sqlite = require("bun:sqlite");

//#region src/bun-sqlite/driver.ts
var SQLiteBunDatabase = class extends __sqlite_core_db_ts.BaseSQLiteDatabase {
	static [__entity_ts.entityKind] = "SQLiteBunDatabase";
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
	const db = new SQLiteBunDatabase("sync", dialect, new require_bun_sqlite_session.SQLiteBunSession(client, dialect, relations, schema, { logger }), relations, schema);
	db.$client = client;
	return db;
}
function drizzle(...params) {
	if (params[0] === void 0 || typeof params[0] === "string") return construct(params[0] === void 0 ? new bun_sqlite.Database() : new bun_sqlite.Database(params[0]), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	if (typeof connection === "object") {
		const { source, ...opts } = connection;
		return construct(new bun_sqlite.Database(source, Object.values(opts).filter((v) => v !== void 0).length ? opts : void 0), drizzleConfig);
	}
	return construct(new bun_sqlite.Database(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.SQLiteBunDatabase = SQLiteBunDatabase;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map