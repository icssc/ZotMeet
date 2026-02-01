const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_cockroach_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let pg = require("pg");
pg = require_rolldown_runtime.__toESM(pg);
let __cockroach_core_db_ts = require("../cockroach-core/db.cjs");
let __cockroach_core_dialect_ts = require("../cockroach-core/dialect.cjs");

//#region src/cockroach/driver.ts
var NodeCockroachDriver = class {
	static [__entity_ts.entityKind] = "NodeCockroachDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
	}
	createSession(schema) {
		return new require_cockroach_session.NodeCockroachSession(this.client, this.dialect, schema, { logger: this.options.logger });
	}
};
var NodeCockroachDatabase = class extends __cockroach_core_db_ts.CockroachDatabase {
	static [__entity_ts.entityKind] = "NodeCockroachDatabase";
};
function construct(client, config = {}) {
	const dialect = new __cockroach_core_dialect_ts.CockroachDialect({ casing: config.casing });
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
	const db = new NodeCockroachDatabase(dialect, new NodeCockroachDriver(client, dialect, { logger }).createSession(schema), schema);
	db.$client = client;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct(new pg.default.Pool({ connectionString: params[0] }), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	return construct(typeof connection === "string" ? new pg.default.Pool({ connectionString: connection }) : new pg.default.Pool(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.NodeCockroachDatabase = NodeCockroachDatabase;
exports.NodeCockroachDriver = NodeCockroachDriver;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map