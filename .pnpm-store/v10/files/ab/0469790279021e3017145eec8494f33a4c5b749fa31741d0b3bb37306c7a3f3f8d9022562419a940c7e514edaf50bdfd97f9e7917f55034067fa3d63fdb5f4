const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_xata_http_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __pg_core_async_db_ts = require("../pg-core/async/db.cjs");
let __pg_core_dialect_ts = require("../pg-core/dialect.cjs");

//#region src/xata-http/driver.ts
var XataHttpDriver = class {
	static [__entity_ts.entityKind] = "XataDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
		this.initMappers();
	}
	createSession(relations, schema) {
		return new require_xata_http_session.XataHttpSession(this.client, this.dialect, relations, schema, {
			logger: this.options.logger,
			cache: this.options.cache
		});
	}
	initMappers() {}
};
var XataHttpDatabase = class extends __pg_core_async_db_ts.PgAsyncDatabase {
	static [__entity_ts.entityKind] = "XataHttpDatabase";
};
function drizzle(client, config = {}) {
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
	const db = new XataHttpDatabase(dialect, new XataHttpDriver(client, dialect, {
		logger,
		cache: config.cache
	}).createSession(relations, schema), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}

//#endregion
exports.XataHttpDatabase = XataHttpDatabase;
exports.XataHttpDriver = XataHttpDriver;
exports.drizzle = drizzle;
//# sourceMappingURL=driver.cjs.map