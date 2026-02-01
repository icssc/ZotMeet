const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_tidb_serverless_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __mysql_core_db_ts = require("../mysql-core/db.cjs");
let __mysql_core_dialect_ts = require("../mysql-core/dialect.cjs");
let _tidbcloud_serverless = require("@tidbcloud/serverless");

//#region src/tidb-serverless/driver.ts
var TiDBServerlessDatabase = class extends __mysql_core_db_ts.MySqlDatabase {
	static [__entity_ts.entityKind] = "TiDBServerlessDatabase";
};
function construct(client, config = {}) {
	const dialect = new __mysql_core_dialect_ts.MySqlDialect({ casing: config.casing });
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
	const db = new TiDBServerlessDatabase(dialect, new require_tidb_serverless_session.TiDBServerlessSession(client, dialect, void 0, relations, schema, {
		logger,
		cache: config.cache
	}), relations, schema, "default");
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct((0, _tidbcloud_serverless.connect)({ url: params[0] }), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	return construct(typeof connection === "string" ? (0, _tidbcloud_serverless.connect)({ url: connection }) : (0, _tidbcloud_serverless.connect)(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.TiDBServerlessDatabase = TiDBServerlessDatabase;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map