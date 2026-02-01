const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_errors = require('../errors.cjs');
const require_mysql2_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let __mysql_core_db_ts = require("../mysql-core/db.cjs");
let __mysql_core_dialect_ts = require("../mysql-core/dialect.cjs");
let mysql2_promise = require("mysql2/promise");

//#region src/mysql2/driver.ts
var MySql2Driver = class {
	static [__entity_ts.entityKind] = "MySql2Driver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
	}
	createSession(relations, schema, mode) {
		return new require_mysql2_session.MySql2Session(this.client, this.dialect, relations, schema, {
			logger: this.options.logger,
			mode,
			cache: this.options.cache
		});
	}
};
var MySql2Database = class extends __mysql_core_db_ts.MySqlDatabase {
	static [__entity_ts.entityKind] = "MySql2Database";
};
function construct(client, config = {}) {
	const dialect = new __mysql_core_dialect_ts.MySqlDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) logger = new __logger_ts.DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	const clientForInstance = isCallbackClient(client) ? client.promise() : client;
	let schema;
	if (config.schema) {
		if (config.mode === void 0) throw new require_errors.DrizzleError({ message: "You need to specify \"mode\": \"planetscale\" or \"default\" when providing a schema. Read more: https://orm.drizzle.team/docs/rqb#modes" });
		const tablesConfig = ___relations_ts.extractTablesRelationalConfig(config.schema, ___relations_ts.createTableRelationsHelpers);
		schema = {
			fullSchema: config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap
		};
	}
	const mode = config.mode ?? "default";
	const relations = config.relations ?? {};
	const db = new MySql2Database(dialect, new MySql2Driver(clientForInstance, dialect, {
		logger,
		cache: config.cache
	}).createSession(relations, schema, mode), relations, schema, mode);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function isCallbackClient(client) {
	return typeof client.promise === "function";
}
function drizzle(...params) {
	if (typeof params[0] === "string") {
		const connectionString = params[0];
		return construct((0, mysql2_promise.createPool)({ uri: connectionString }), params[1]);
	}
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	return construct(typeof connection === "string" ? (0, mysql2_promise.createPool)({
		uri: connection,
		supportBigNumbers: true
	}) : (0, mysql2_promise.createPool)(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.MySql2Database = MySql2Database;
exports.MySql2Driver = MySql2Driver;
Object.defineProperty(exports, 'MySqlDatabase', {
  enumerable: true,
  get: function () {
    return __mysql_core_db_ts.MySqlDatabase;
  }
});
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map