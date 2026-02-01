const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_gel_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let gel = require("gel");
let __gel_core_db_ts = require("../gel-core/db.cjs");
let __gel_core_dialect_ts = require("../gel-core/dialect.cjs");

//#region src/gel/driver.ts
var GelDriver = class {
	static [__entity_ts.entityKind] = "GelDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
	}
	createSession(relations, schema) {
		return new require_gel_session.GelDbSession(this.client, this.dialect, relations, schema, {
			logger: this.options.logger,
			cache: this.options.cache
		});
	}
};
var GelJsDatabase = class extends __gel_core_db_ts.GelDatabase {
	static [__entity_ts.entityKind] = "GelJsDatabase";
};
function construct(client, config = {}) {
	const dialect = new __gel_core_dialect_ts.GelDialect({ casing: config.casing });
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
	const db = new GelJsDatabase(dialect, new GelDriver(client, dialect, {
		logger,
		cache: config.cache
	}).createSession(relations, schema), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct((0, gel.createClient)({ dsn: params[0] }), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	return construct((0, gel.createClient)(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.GelDriver = GelDriver;
exports.GelJsDatabase = GelJsDatabase;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map