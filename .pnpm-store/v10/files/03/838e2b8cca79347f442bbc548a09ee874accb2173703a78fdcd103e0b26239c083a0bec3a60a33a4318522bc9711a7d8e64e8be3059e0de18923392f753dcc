import { NeonHttpSession } from "./session.js";
import { entityKind } from "../entity.js";
import * as V1 from "../_relations.js";
import { DefaultLogger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import { neon, types } from "@neondatabase/serverless";

//#region src/neon-http/driver.ts
var NeonHttpDriver = class {
	static [entityKind] = "NeonHttpDriver";
	constructor(client, dialect, options = {}) {
		this.client = client;
		this.dialect = dialect;
		this.options = options;
		this.initMappers();
	}
	createSession(relations, schema) {
		return new NeonHttpSession(this.client, this.dialect, relations ?? {}, schema, {
			logger: this.options.logger,
			cache: this.options.cache
		});
	}
	initMappers() {
		types.setTypeParser(types.builtins.TIMESTAMPTZ, (val) => val);
		types.setTypeParser(types.builtins.TIMESTAMP, (val) => val);
		types.setTypeParser(types.builtins.DATE, (val) => val);
		types.setTypeParser(types.builtins.INTERVAL, (val) => val);
		types.setTypeParser(1231, (val) => val);
		types.setTypeParser(1115, (val) => val);
		types.setTypeParser(1185, (val) => val);
		types.setTypeParser(1187, (val) => val);
		types.setTypeParser(1182, (val) => val);
	}
};
function wrap(target, token, cb, deep) {
	return new Proxy(target, { get(target$1, p) {
		const element = target$1[p];
		if (typeof element !== "function" && (typeof element !== "object" || element === null)) return element;
		if (deep) return wrap(element, token, cb);
		if (p === "query" || p === "_query") return wrap(element, token, cb, true);
		if (p === "execute") return new Proxy(element, { apply(target$2, thisArg, argArray) {
			return target$2.call(thisArg, ...argArray, token);
		} });
		return new Proxy(element, { apply(target$2, thisArg, argArray) {
			const res = target$2.call(thisArg, ...argArray);
			if (typeof res === "object" && res !== null && "setToken" in res && typeof res.setToken === "function") res.setToken(token);
			return cb(target$2, p, res);
		} });
	} });
}
var NeonHttpDatabase = class extends PgAsyncDatabase {
	static [entityKind] = "NeonHttpDatabase";
	$withAuth(token) {
		return wrap(this, token, (target, p, res) => {
			if (p === "with") return wrap(res, token, (_, __, res$1) => res$1);
			return res;
		});
	}
	async batch(batch) {
		return this.session.batch(batch);
	}
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
	const db = new NeonHttpDatabase(dialect, new NeonHttpDriver(client, dialect, {
		logger,
		cache: config.cache
	}).createSession(relations, schema), relations, schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (typeof params[0] === "string") return construct(neon(params[0]), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return construct(client, drizzleConfig);
	if (typeof connection === "object") {
		const { connectionString, ...options } = connection;
		return construct(neon(connectionString, options), drizzleConfig);
	}
	return construct(neon(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
export { NeonHttpDatabase, NeonHttpDriver, drizzle };
//# sourceMappingURL=driver.js.map