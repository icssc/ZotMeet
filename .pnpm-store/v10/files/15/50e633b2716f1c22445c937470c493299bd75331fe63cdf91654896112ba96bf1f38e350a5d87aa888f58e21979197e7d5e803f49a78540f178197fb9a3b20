const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_vercel_postgres_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __pg_core_async_db_ts = require("../pg-core/async/db.cjs");
let __pg_core_index_ts = require("../pg-core/index.cjs");
let _vercel_postgres = require("@vercel/postgres");

//#region src/vercel-postgres/driver.ts
var VercelPgDriver = class {
	static [__entity_ts.entityKind] = "VercelPgDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
	}
	createSession(relations, schema) {
		return new require_vercel_postgres_session.VercelPgSession(this.client, this.dialect, relations, schema, {
			logger: this.options.logger,
			cache: this.options.cache
		});
	}
};
var VercelPgDatabase = class extends __pg_core_async_db_ts.PgAsyncDatabase {
	static [__entity_ts.entityKind] = "VercelPgDatabase";
};
function construct(client, config = {}) {
	const dialect = new __pg_core_index_ts.PgDialect({ casing: config.casing });
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
	const db = new VercelPgDatabase(dialect, new VercelPgDriver(client, dialect, {
		logger,
		cache: config.cache
	}).createSession(relations, schema), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if ((0, __utils_ts.isConfig)(params[0])) {
		const { client, ...drizzleConfig } = params[0];
		return construct(client ?? _vercel_postgres.sql, drizzleConfig);
	}
	return construct(params[0] ?? _vercel_postgres.sql, params[1]);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.VercelPgDatabase = VercelPgDatabase;
exports.VercelPgDriver = VercelPgDriver;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map