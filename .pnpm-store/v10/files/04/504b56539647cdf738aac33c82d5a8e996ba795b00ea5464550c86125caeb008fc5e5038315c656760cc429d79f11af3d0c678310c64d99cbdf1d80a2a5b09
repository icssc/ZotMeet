const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let ___relations_ts = require("../../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/sqlite-core/query-builders/_query.ts
var _RelationalQueryBuilder = class {
	static [__entity_ts.entityKind] = "SQLiteAsyncRelationalQueryBuilder";
	constructor(mode, fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
		this.mode = mode;
		this.fullSchema = fullSchema;
		this.schema = schema;
		this.tableNamesMap = tableNamesMap;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
	}
	findMany(config) {
		return this.mode === "sync" ? new SQLiteSyncRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, "many") : new SQLiteRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, "many");
	}
	findFirst(config) {
		return this.mode === "sync" ? new SQLiteSyncRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? {
			...config,
			limit: 1
		} : { limit: 1 }, "first") : new SQLiteRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? {
			...config,
			limit: 1
		} : { limit: 1 }, "first");
	}
};
var SQLiteRelationalQuery = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "SQLiteAsyncRelationalQuery";
	/** @internal */
	mode;
	constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
		super();
		this.fullSchema = fullSchema;
		this.schema = schema;
		this.tableNamesMap = tableNamesMap;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
		this.config = config;
		this.mode = mode;
	}
	/** @internal */
	getSQL() {
		return this.dialect._buildRelationalQuery({
			fullSchema: this.fullSchema,
			schema: this.schema,
			tableNamesMap: this.tableNamesMap,
			table: this.table,
			tableConfig: this.tableConfig,
			queryConfig: this.config,
			tableAlias: this.tableConfig.tsName
		}).sql;
	}
	/** @internal */
	_prepare(isOneTimeQuery = false) {
		const { query, builtQuery } = this._toSQL();
		return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](builtQuery, void 0, this.mode === "first" ? "get" : "all", true, (rawRows, mapColumnValue) => {
			const rows = rawRows.map((row) => ___relations_ts.mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue));
			if (this.mode === "first") return rows[0];
			return rows;
		});
	}
	prepare() {
		return this._prepare(false);
	}
	_toSQL() {
		const query = this.dialect._buildRelationalQuery({
			fullSchema: this.fullSchema,
			schema: this.schema,
			tableNamesMap: this.tableNamesMap,
			table: this.table,
			tableConfig: this.tableConfig,
			queryConfig: this.config,
			tableAlias: this.tableConfig.tsName
		});
		return {
			query,
			builtQuery: this.dialect.sqlToQuery(query.sql)
		};
	}
	toSQL() {
		return this._toSQL().builtQuery;
	}
	/** @internal */
	executeRaw() {
		if (this.mode === "first") return this._prepare(false).get();
		return this._prepare(false).all();
	}
	async execute() {
		return this.executeRaw();
	}
};
var SQLiteSyncRelationalQuery = class extends SQLiteRelationalQuery {
	static [__entity_ts.entityKind] = "SQLiteSyncRelationalQuery";
	sync() {
		return this.executeRaw();
	}
};

//#endregion
exports.SQLiteRelationalQuery = SQLiteRelationalQuery;
exports.SQLiteSyncRelationalQuery = SQLiteSyncRelationalQuery;
exports._RelationalQueryBuilder = _RelationalQueryBuilder;
//# sourceMappingURL=_query.cjs.map