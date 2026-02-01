import { DrizzleError } from "../errors.js";
import { MySql2Session } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { MySqlDatabase, MySqlDatabase as MySqlDatabase$1 } from "../mysql-core/db.js";
import { MySqlDialect } from "../mysql-core/dialect.js";
import { createPool } from "mysql2/promise";

//#region src/mysql2/driver.ts
var MySql2Driver = class {
	static [entityKind] = "MySql2Driver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
	}
	createSession(relations, schema, mode) {
		return new MySql2Session(this.client, this.dialect, relations, schema, {
			logger: this.options.logger,
			mode,
			cache: this.options.cache
		});
	}
};
var MySql2Database = class extends MySqlDatabase$1 {
	static [entityKind] = "MySql2Database";
};
function construct(client, config = {}) {
	const dialect = new MySqlDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	const clientForInstance = isCallbackClient(client) ? client.promise() : client;
	let schema;
	if (config.schema) {
		if (config.mode === void 0) throw new DrizzleError({ message: "You need to specify \"mode\": \"planetscale\" or \"default\" when providing a schema. Read more: https://orm.drizzle.team/docs/rqb#modes" });
		const tablesConfig = V1.extractTablesRelationalConfig(config.schema, V1.createTableRelationsHelpers);
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
		return construct(createPool({ uri: connectionString }), params[1]);
	}
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	return construct(typeof connection === "string" ? createPool({
		uri: connection,
		supportBigNumbers: true
	}) : createPool(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
export { MySql2Database, MySql2Driver, MySqlDatabase, drizzle };
//# sourceMappingURL=driver.js.map