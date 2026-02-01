const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __query_promise_ts = require("../../query-promise.cjs");
let __relations_ts = require("../../relations.cjs");

//#region src/gel-core/query-builders/query.ts
var RelationalQueryBuilder = class {
	static [__entity_ts.entityKind] = "GelRelationalQueryBuilderV2";
	constructor(schema, table, tableConfig, dialect, session) {
		this.schema = schema;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
	}
	findMany(config) {
		return new PgRelationalQuery(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "many");
	}
	findFirst(config) {
		return new PgRelationalQuery(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "first");
	}
};
var PgRelationalQuery = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "GelRelationalQueryV2";
	constructor(schema, table, tableConfig, dialect, session, config, mode) {
		super();
		this.schema = schema;
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
			return this.session.prepareRelationalQuery(builtQuery, void 0, name, (rows, mapColumnValue) => {
				for (const row of rows) (0, __relations_ts.mapRelationalRow)(row, query.selection, mapColumnValue);
				if (this.mode === "first") return rows[0];
				return rows;
			});
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	_getQuery() {
		return this.dialect.buildRelationalQuery({
			schema: this.schema,
			table: this.table,
			tableConfig: this.tableConfig,
			queryConfig: this.config,
			mode: this.mode
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
			return this._prepare().execute();
		});
	}
};

//#endregion
exports.PgRelationalQuery = PgRelationalQuery;
exports.RelationalQueryBuilder = RelationalQueryBuilder;
//# sourceMappingURL=query.cjs.map