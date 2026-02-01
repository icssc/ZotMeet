import { PgliteSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import { PGlite } from "@electric-sql/pglite";

//#region src/pglite/driver.ts
var PgliteDriver = class {
	static [entityKind] = "PgliteDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
	}
	createSession(relations, schema) {
		return new PgliteSession(this.client, this.dialect, relations, schema, {
			logger: this.options.logger,
			cache: this.options.cache
		});
	}
};
var PgliteDatabase = class extends PgAsyncDatabase {
	static [entityKind] = "PgliteDatabase";
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
	const db = new PgliteDatabase(dialect, new PgliteDriver(client, dialect, {
		logger,
		cache: config.cache
	}).createSession(relations, schema), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (params[0] === void 0 || typeof params[0] === "string") return construct(new PGlite(params[0]), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	if (typeof connection === "object") {
		const { dataDir, ...options } = connection;
		return construct(new PGlite(dataDir, options), drizzleConfig);
	}
	return construct(new PGlite(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
export { PgliteDatabase, PgliteDriver, drizzle };
//# sourceMappingURL=driver.js.map