const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_planetscale_serverless_session = require('./session.cjs');
let __entity_ts = require("../entity.cjs");
let ___relations_ts = require("../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../logger.cjs");
let _planetscale_database = require("@planetscale/database");
let __mysql_core_db_ts = require("../mysql-core/db.cjs");
let __mysql_core_dialect_ts = require("../mysql-core/dialect.cjs");

//#region src/planetscale-serverless/driver.ts
var PlanetScaleDatabase = class extends __mysql_core_db_ts.MySqlDatabase {
	static [__entity_ts.entityKind] = "PlanetScaleDatabase";
};
function construct(client, config = {}) {
	if (!(client instanceof _planetscale_database.Client)) throw new Error(`Warning: You need to pass an instance of Client:

import { Client } from "@planetscale/database";

const client = new Client({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

const db = drizzle({ client });
		`);
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
	const db = new PlanetScaleDatabase(dialect, new require_planetscale_serverless_session.PlanetscaleSession(client, dialect, void 0, relations, schema, {
		logger,
		cache: config.cache
	}), relations, schema, "planetscale");
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct(new _planetscale_database.Client({ url: params[0] }), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	return construct(typeof connection === "string" ? new _planetscale_database.Client({ url: connection }) : new _planetscale_database.Client(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.PlanetScaleDatabase = PlanetScaleDatabase;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map