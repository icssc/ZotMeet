import { VercelPgSession } from "./session.js";
import { entityKind } from "../entity.js";
import { isConfig } from "../utils.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { PgDialect } from "../pg-core/index.js";
import { sql } from "@vercel/postgres";

//#region src/vercel-postgres/driver.ts
var VercelPgDriver = class {
	static [entityKind] = "VercelPgDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
	}
	createSession(relations, schema) {
		return new VercelPgSession(this.client, this.dialect, relations, schema, {
			logger: this.options.logger,
			cache: this.options.cache
		});
	}
};
var VercelPgDatabase = class extends PgAsyncDatabase {
	static [entityKind] = "VercelPgDatabase";
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
	const db = new VercelPgDatabase(dialect, new VercelPgDriver(client, dialect, {
		logger,
		cache: config.cache
	}).createSession(relations, schema), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (isConfig(params[0])) {
		const { client, ...drizzleConfig } = params[0];
		return construct(client ?? sql, drizzleConfig);
	}
	return construct(params[0] ?? sql, params[1]);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
export { VercelPgDatabase, VercelPgDriver, drizzle };
//# sourceMappingURL=driver.js.map