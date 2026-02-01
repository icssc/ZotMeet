import { BunSQLSession } from "./session.js";
import { entityKind } from "../../entity.js";
import * as V1 from "../../_relations.js";
import { DefaultLogger } from "../../logger.js";
import { PgAsyncDatabase } from "../../pg-core/async/db.js";
import { PgDialect } from "../../pg-core/dialect.js";
import { SQL } from "bun";

//#region src/bun-sql/postgres/driver.ts
var BunSQLDatabase = class extends PgAsyncDatabase {
	static [entityKind] = "BunSQLDatabase";
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
	const db = new BunSQLDatabase(dialect, new BunSQLSession(client, dialect, relations, schema, {
		logger,
		cache: config.cache
	}), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct(new SQL(params[0]), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	if (typeof connection === "object" && connection.url !== void 0) {
		const { url, ...config } = connection;
		return construct(new SQL({
			url,
			...config
		}), drizzleConfig);
	}
	return construct(new SQL(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({ options: {
			parsers: {},
			serializers: {}
		} }, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
export { BunSQLDatabase, drizzle };
//# sourceMappingURL=driver.js.map