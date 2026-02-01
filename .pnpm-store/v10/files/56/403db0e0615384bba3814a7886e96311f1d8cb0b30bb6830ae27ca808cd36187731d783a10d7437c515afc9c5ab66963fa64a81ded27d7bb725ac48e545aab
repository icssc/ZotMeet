import { BunMySqlSession } from "./session.js";
import { entityKind } from "../../entity.js";
import * as V1 from "../../_relations.js";
import { DefaultLogger } from "../../logger.js";
import { MySqlDatabase } from "../../mysql-core/db.js";
import { MySqlDialect } from "../../mysql-core/dialect.js";
import { DrizzleError } from "../../errors.js";
import { SQL } from "bun";

//#region src/bun-sql/mysql/driver.ts
var BunMySqlDatabase = class extends MySqlDatabase {
	static [entityKind] = "BunMySqlDatabase";
};
function construct(client, config = {}) {
	const dialect = new MySqlDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
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
	const db = new BunMySqlDatabase(dialect, new BunMySqlSession(client, dialect, relations, schema, {
		logger,
		mode,
		cache: config.cache
	}), relations, schema, mode);
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
export { BunMySqlDatabase, drizzle };
//# sourceMappingURL=driver.js.map