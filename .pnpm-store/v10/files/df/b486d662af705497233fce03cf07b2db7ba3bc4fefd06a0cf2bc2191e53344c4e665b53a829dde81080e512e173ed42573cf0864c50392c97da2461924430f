const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_neon_http_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __pg_core_async_db_ts = require("../pg-core/async/db.cjs");
let __pg_core_dialect_ts = require("../pg-core/dialect.cjs");
let _neondatabase_serverless = require("@neondatabase/serverless");

//#region src/neon-http/driver.ts
var NeonHttpDriver = class {
	static [__entity_ts.entityKind] = "NeonHttpDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
		this.initMappers();
	}
	createSession(relations, schema) {
		return new require_neon_http_session.NeonHttpSession(this.client, this.dialect, relations ?? {}, schema, {
			logger: this.options.logger,
			cache: this.options.cache
		});
	}
	initMappers() {
		_neondatabase_serverless.types.setTypeParser(_neondatabase_serverless.types.builtins.TIMESTAMPTZ, (val) => val);
		_neondatabase_serverless.types.setTypeParser(_neondatabase_serverless.types.builtins.TIMESTAMP, (val) => val);
		_neondatabase_serverless.types.setTypeParser(_neondatabase_serverless.types.builtins.DATE, (val) => val);
		_neondatabase_serverless.types.setTypeParser(_neondatabase_serverless.types.builtins.INTERVAL, (val) => val);
		_neondatabase_serverless.types.setTypeParser(1231, (val) => val);
		_neondatabase_serverless.types.setTypeParser(1115, (val) => val);
		_neondatabase_serverless.types.setTypeParser(1185, (val) => val);
		_neondatabase_serverless.types.setTypeParser(1187, (val) => val);
		_neondatabase_serverless.types.setTypeParser(1182, (val) => val);
	}
};
function wrap(target, token, cb, deep) {
	return new Proxy(target, { get(target$1, p) {
		const element = target$1[p];
		if (typeof element !== "function" && (typeof element !== "object" || element === null)) return element;
		if (deep) return wrap(element, token, cb);
		if (p === "query" || p === "_query") return wrap(element, token, cb, true);
		if (p === "execute") return new Proxy(element, { apply(target$2, thisArg, argArray) {
			return target$2.call(thisArg, ...argArray, token);
		} });
		return new Proxy(element, { apply(target$2, thisArg, argArray) {
			const res = target$2.call(thisArg, ...argArray);
			if (typeof res === "object" && res !== null && "setToken" in res && typeof res.setToken === "function") res.setToken(token);
			return cb(target$2, p, res);
		} });
	} });
}
var NeonHttpDatabase = class extends __pg_core_async_db_ts.PgAsyncDatabase {
	static [__entity_ts.entityKind] = "NeonHttpDatabase";
	$withAuth(token) {
		return wrap(this, token, (target, p, res) => {
			if (p === "with") return wrap(res, token, (_, __, res$1) => res$1);
			return res;
		});
	}
	async batch(batch) {
		return this.session.batch(batch);
	}
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
	const db = new NeonHttpDatabase(dialect, new NeonHttpDriver(client, dialect, {
		logger,
		cache: config.cache
	}).createSession(relations, schema), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct((0, _neondatabase_serverless.neon)(params[0]), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	if (typeof connection === "object") {
		const { connectionString, ...options } = connection;
		return construct((0, _neondatabase_serverless.neon)(connectionString, options), drizzleConfig);
	}
	return construct((0, _neondatabase_serverless.neon)(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.NeonHttpDatabase = NeonHttpDatabase;
exports.NeonHttpDriver = NeonHttpDriver;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map