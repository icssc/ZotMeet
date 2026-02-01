import { NeonSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import { Pool, neonConfig } from "@neondatabase/serverless";

//#region src/neon-serverless/driver.ts
var NeonDriver = class {
	static [entityKind] = "NeonDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
	}
	createSession(relations, schema) {
		return new NeonSession(this.client, this.dialect, relations, schema, {
			logger: this.options.logger,
			cache: this.options.cache
		});
	}
};
var NeonDatabase = class extends PgAsyncDatabase {
	static [entityKind] = "NeonServerlessDatabase";
};
function construct(client, config = {}) {
	const dialect = new PgDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	let schema;
	if (config.schema) {
		const tablesConfig = V1.extractTablesRelationalConfig(config.schema, V1.createTableRelationsHelpers);
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
	if (typeof params[0] === "string") return construct(new Pool({ connectionString: params[0] }), params[1]);
	const { connection, client, ws, ...drizzleConfig } = params[0];
	if (ws) neonConfig.webSocketConstructor = ws;
	if (client) return construct(client, drizzleConfig);
	return construct(typeof connection === "string" ? new Pool({ connectionString: connection }) : new Pool(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
export { NeonDatabase, NeonDriver, drizzle };
//# sourceMappingURL=driver.js.map