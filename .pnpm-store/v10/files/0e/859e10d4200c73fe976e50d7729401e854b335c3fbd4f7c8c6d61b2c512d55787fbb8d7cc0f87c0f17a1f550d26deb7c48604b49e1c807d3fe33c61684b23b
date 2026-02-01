import { BunSQLiteSession } from "./session.js";
import { entityKind } from "../../entity.js";
import * as V1 from "../../_relations.js";
import { DefaultLogger } from "../../logger.js";
import { BaseSQLiteDatabase } from "../../sqlite-core/db.js";
import { SQLiteAsyncDialect } from "../../sqlite-core/dialect.js";
import { SQL } from "bun";

//#region src/bun-sql/sqlite/driver.ts
var BunSQLiteDatabase = class extends BaseSQLiteDatabase {
	static [entityKind] = "BunSQLiteDatabase";
};
function construct(client, config = {}) {
	const dialect = new SQLiteAsyncDialect({ casing: config.casing });
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
	const db = new BunSQLiteDatabase("async", dialect, new BunSQLiteSession(client, dialect, relations, schema, {
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
export { BunSQLiteDatabase, drizzle };
//# sourceMappingURL=driver.js.map