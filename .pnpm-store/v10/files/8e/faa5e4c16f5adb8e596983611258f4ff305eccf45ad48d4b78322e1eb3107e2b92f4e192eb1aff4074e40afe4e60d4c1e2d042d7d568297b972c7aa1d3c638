const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let ___relations_ts = require("../../_relations.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/cockroach-core/query-builders/query.ts
var RelationalQueryBuilder = class {
	static [__entity_ts.entityKind] = "CockroachRelationalQueryBuilder";
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
		return new CockroachRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, "many");
	}
	findFirst(config) {
		return new CockroachRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? {
			...config,
			limit: 1
		} : { limit: 1 }, "first");
	}
};
var CockroachRelationalQuery = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "CockroachRelationalQuery";
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
				const rows = rawRows.map((row) => (0, ___relations_ts.mapRelationalRow)(this.schema, this.tableConfig, row, query.selection, mapColumnValue));
				if (this.mode === "first") return rows[0];
				return rows;
			});
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	_getQuery() {
		return this.dialect.buildRelationalQueryWithoutPK({
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
		const { typings: _typings, ...builtQuery } = this.dialect.sqlToQuery(query.sql);
		return {
			query,
			builtQuery
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
exports.CockroachRelationalQuery = CockroachRelationalQuery;
exports.RelationalQueryBuilder = RelationalQueryBuilder;
//# sourceMappingURL=query.cjs.map