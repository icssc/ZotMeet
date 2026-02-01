const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_bun_sql_postgres_session = require('./session.cjs');
let __entity_ts = require("../../entity.cjs");
let ___relations_ts = require("../../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../../logger.cjs");
let __pg_core_async_db_ts = require("../../pg-core/async/db.cjs");
let __pg_core_dialect_ts = require("../../pg-core/dialect.cjs");
let bun = require("bun");

//#region src/bun-sql/postgres/driver.ts
var BunSQLDatabase = class extends __pg_core_async_db_ts.PgAsyncDatabase {
	static [__entity_ts.entityKind] = "BunSQLDatabase";
};
function construct(client, config = {}) {
	const dialect = new __pg_core_dialect_ts.PgDialect({ casing: config.casing });
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
	const db = new BunSQLDatabase(dialect, new require_bun_sql_postgres_session.BunSQLSession(client, dialect, relations, schema, {
		logger,
		cache: config.cache
	}), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct(new bun.SQL(params[0]), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	if (typeof connection === "object" && connection.url !== void 0) {
		const { url, ...config } = connection;
		return construct(new bun.SQL({
			url,
			...config
		}), drizzleConfig);
	}
	return construct(new bun.SQL(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({ options: {
			parsers: {},
			serializers: {}
		} }, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.BunSQLDatabase = BunSQLDatabase;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map