const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let ___relations_ts = require("../../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/mysql-core/query-builders/_query.ts
var _RelationalQueryBuilder = class {
	static [__entity_ts.entityKind] = "MySqlRelationalQueryBuilder";
	constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, mode) {
		this.fullSchema = fullSchema;
		this.schema = schema;
		this.tableNamesMap = tableNamesMap;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
		this.mode = mode;
	}
	findMany(config) {
		return new MySqlRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, "many", this.mode);
	}
	findFirst(config) {
		return new MySqlRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? {
			...config,
			limit: 1
		} : { limit: 1 }, "first", this.mode);
	}
};
var MySqlRelationalQuery = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "MySqlRelationalQuery";
	constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, queryMode, mode) {
		super();
		this.fullSchema = fullSchema;
		this.schema = schema;
		this.tableNamesMap = tableNamesMap;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
		this.config = config;
		this.queryMode = queryMode;
		this.mode = mode;
	}
	prepare() {
		const { query, builtQuery } = this._toSQL();
		return this.session.prepareQuery(builtQuery, void 0, (rawRows) => {
			const rows = rawRows.map((row) => ___relations_ts.mapRelationalRow(this.schema, this.tableConfig, row, query.selection));
			if (this.queryMode === "first") return rows[0];
			return rows;
		});
	}
	_getQuery() {
		return this.mode === "planetscale" ? this.dialect._buildRelationalQueryWithoutLateralSubqueries({
			fullSchema: this.fullSchema,
			schema: this.schema,
			tableNamesMap: this.tableNamesMap,
			table: this.table,
			tableConfig: this.tableConfig,
			queryConfig: this.config,
			tableAlias: this.tableConfig.tsName
		}) : this.dialect._buildRelationalQuery({
			fullSchema: this.fullSchema,
			schema: this.schema,
			tableNamesMap: this.tableNamesMap,
			table: this.table,
			tableConfig: this.tableConfig,
			queryConfig: this.config,
			tableAlias: this.tableConfig.tsName
		});
	}
	_toSQL() {
		const query = this._getQuery();
		return {
			builtQuery: this.dialect.sqlToQuery(query.sql),
			query
		};
	}
	/** @internal */
	getSQL() {
		return this._getQuery().sql;
	}
	toSQL() {
		return this._toSQL().builtQuery;
	}
	execute() {
		return this.prepare().execute();
	}
};

//#endregion
exports.MySqlRelationalQuery = MySqlRelationalQuery;
exports._RelationalQueryBuilder = _RelationalQueryBuilder;
//# sourceMappingURL=_query.cjs.map