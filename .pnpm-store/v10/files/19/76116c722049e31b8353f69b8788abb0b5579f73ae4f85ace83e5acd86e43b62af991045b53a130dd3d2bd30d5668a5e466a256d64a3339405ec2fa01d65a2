const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_neon_serverless_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __pg_core_async_db_ts = require("../pg-core/async/db.cjs");
let __pg_core_dialect_ts = require("../pg-core/dialect.cjs");
let _neondatabase_serverless = require("@neondatabase/serverless");

//#region src/neon-serverless/driver.ts
var NeonDriver = class {
	static [__entity_ts.entityKind] = "NeonDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
	}
	createSession(relations, schema) {
		return new require_neon_serverless_session.NeonSession(this.client, this.dialect, relations, schema, {
			logger: this.options.logger,
			cache: this.options.cache
		});
	}
};
var NeonDatabase = class extends __pg_core_async_db_ts.PgAsyncDatabase {
	static [__entity_ts.entityKind] = "NeonServerlessDatabase";
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
	const db = new NeonDatabase(dialect, new NeonDriver(client, dialect, {
		logger,
		cache: config.cache
	}).createSession(relations, schema), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct(new _neondatabase_serverless.Pool({ connectionString: params[0] }), params[1]);
	const { connection, client, ws, ...drizzleConfig } = params[0];
	if (ws) _neondatabase_serverless.neonConfig.webSocketConstructor = ws;
	if (client) return construct(client, drizzleConfig);
	return construct(typeof connection === "string" ? new _neondatabase_serverless.Pool({ connectionString: connection }) : new _neondatabase_serverless.Pool(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.NeonDatabase = NeonDatabase;
exports.NeonDriver = NeonDriver;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map