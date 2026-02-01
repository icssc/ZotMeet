import { PlanetscaleSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { Client } from "@planetscale/database";
import { MySqlDatabase } from "../mysql-core/db.js";
import { MySqlDialect } from "../mysql-core/dialect.js";

//#region src/planetscale-serverless/driver.ts
var PlanetScaleDatabase = class extends MySqlDatabase {
	static [entityKind] = "PlanetScaleDatabase";
};
function construct(client, config = {}) {
	if (!(client instanceof Client)) throw new Error(`Warning: You need to pass an instance of Client:

import { Client } from "@planetscale/database";

const client = new Client({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

const db = drizzle({ client });
		`);
	const dialect = new MySqlDialect({ casing: config.casing });
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
	const db = new PlanetScaleDatabase(dialect, new PlanetscaleSession(client, dialect, void 0, relations, schema, {
		logger,
		cache: config.cache
	}), relations, schema, "planetscale");
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct(new Client({ url: params[0] }), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	return construct(typeof connection === "string" ? new Client({ url: connection }) : new Client(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
export { PlanetScaleDatabase, drizzle };
//# sourceMappingURL=driver.js.map