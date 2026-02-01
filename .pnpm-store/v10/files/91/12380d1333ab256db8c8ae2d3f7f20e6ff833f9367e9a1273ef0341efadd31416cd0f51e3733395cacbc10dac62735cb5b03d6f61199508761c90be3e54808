import { SQLiteBunSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { SQLiteSyncDialect } from "../sqlite-core/dialect.js";
import { Database } from "bun:sqlite";

//#region src/bun-sqlite/driver.ts
var SQLiteBunDatabase = class extends BaseSQLiteDatabase {
	static [entityKind] = "SQLiteBunDatabase";
};
function construct(client, config = {}) {
	const dialect = new SQLiteSyncDialect({ casing: config.casing });
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
	const db = new SQLiteBunDatabase("sync", dialect, new SQLiteBunSession(client, dialect, relations, schema, { logger }), relations, schema);
	db.$client = client;
	return db;
}
function drizzle(...params) {
	if (params[0] === void 0 || typeof params[0] === "string") return construct(params[0] === void 0 ? new Database() : new Database(params[0]), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	if (typeof connection === "object") {
		const { source, ...opts } = connection;
		return construct(new Database(source, Object.values(opts).filter((v) => v !== void 0).length ? opts : void 0), drizzleConfig);
	}
	return construct(new Database(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
export { SQLiteBunDatabase, drizzle };
//# sourceMappingURL=driver.js.map