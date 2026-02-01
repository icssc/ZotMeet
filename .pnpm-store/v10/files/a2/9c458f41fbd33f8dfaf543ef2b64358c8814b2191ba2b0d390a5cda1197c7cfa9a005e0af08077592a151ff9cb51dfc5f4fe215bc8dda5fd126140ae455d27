const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let ___relations_ts = require("../../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/pg-core/query-builders/_query.ts
var _RelationalQueryBuilder = class {
	static [__entity_ts.entityKind] = "PgRelationalQueryBuilder";
	constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
		this.fullSchema = fullSchema;
		this.schema = schema;
		this.tableNamesMap = tableNamesMap;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
	}
	findMany(config) {
		return new _PgRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, "many");
	}
	findFirst(config) {
		return new _PgRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? {
			...config,
			limit: 1
		} : { limit: 1 }, "first");
	}
};
var _PgRelationalQuery = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "PgRelationalQuery";
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
	_prepare(name) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const { query, builtQuery } = this._toSQL();
			return this.session.prepareQuery(builtQuery, void 0, name, true, (rawRows, mapColumnValue) => {
				const rows = rawRows.map((row) => ___relations_ts.mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue));
				if (this.mode === "first") return rows[0];
				return rows;
			});
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	_getQuery() {
		return this.dialect._buildRelationalQuery({
			fullSchema: this.fullSchema,
			schema: this.schema,
			tableNamesMap: this.tableNamesMap,
			table: this.table,
			tableConfig: this.tableConfig,
			queryConfig: this.config,
			tableAlias: this.tableConfig.tsName
		});
	}
	/** @internal */
	getSQL() {
		return this._getQuery().sql;
	}
	_toSQL() {
		const query = this._getQuery();
		return {
			query,
			builtQuery: this.dialect.sqlToQuery(query.sql)
		};
	}
	toSQL() {
		return this._toSQL().builtQuery;
	}
	authToken;
	/** @internal */
	setToken(token) {
		this.authToken = token;
		return this;
	}
	execute() {
		return __tracing_ts.tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(void 0, this.authToken);
		});
	}
};

//#endregion
exports._PgRelationalQuery = _PgRelationalQuery;
exports._RelationalQueryBuilder = _RelationalQueryBuilder;
//# sourceMappingURL=_query.cjs.map