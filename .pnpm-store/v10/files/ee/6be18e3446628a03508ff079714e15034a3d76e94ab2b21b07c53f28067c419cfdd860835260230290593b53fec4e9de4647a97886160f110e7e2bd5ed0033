import { NodePgSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import pg from "pg";

//#region src/node-postgres/driver.ts
var NodePgDatabase = class extends PgAsyncDatabase {
	static [entityKind] = "NodePgDatabase";
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
	const db = new NodePgDatabase(dialect, new NodePgSession(client, dialect, relations, schema, {
		logger,
		cache: config.cache
	}), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct(new pg.Pool({ connectionString: params[0] }), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	return construct(typeof connection === "string" ? new pg.Pool({ connectionString: connection }) : new pg.Pool(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
export { NodePgDatabase, drizzle };
//# sourceMappingURL=driver.js.map