import { XataHttpSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { PgDialect } from "../pg-core/dialect.js";

//#region src/xata-http/driver.ts
var XataHttpDriver = class {
	static [entityKind] = "XataDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
		this.initMappers();
	}
	createSession(relations, schema) {
		return new XataHttpSession(this.client, this.dialect, relations, schema, {
			logger: this.options.logger,
			cache: this.options.cache
		});
	}
	initMappers() {}
};
var XataHttpDatabase = class extends PgAsyncDatabase {
	static [entityKind] = "XataHttpDatabase";
};
function drizzle(client, config = {}) {
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
	const db = new XataHttpDatabase(dialect, new XataHttpDriver(client, dialect, {
		logger,
		cache: config.cache
	}).createSession(relations, schema), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}

//#endregion
export { XataHttpDatabase, XataHttpDriver, drizzle };
//# sourceMappingURL=driver.js.map