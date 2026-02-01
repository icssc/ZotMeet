import { MySqlRemoteSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { MySqlDatabase } from "../mysql-core/db.js";
import { MySqlDialect } from "../mysql-core/dialect.js";

//#region src/mysql-proxy/driver.ts
var MySqlRemoteDatabase = class extends MySqlDatabase {
	static [entityKind] = "MySqlRemoteDatabase";
};
function drizzle(callback, config = {}, _dialect = () => new MySqlDialect({ casing: config.casing })) {
	const dialect = _dialect();
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
	return new MySqlRemoteDatabase(dialect, new MySqlRemoteSession(callback, dialect, relations, schema, { logger }), relations, schema, "default");
}

//#endregion
export { MySqlRemoteDatabase, drizzle };
//# sourceMappingURL=driver.js.map