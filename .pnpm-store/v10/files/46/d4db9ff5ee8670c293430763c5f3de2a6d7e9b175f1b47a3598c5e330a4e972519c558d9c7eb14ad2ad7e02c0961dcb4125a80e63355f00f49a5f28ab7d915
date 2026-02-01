import { entityKind } from "../../entity.js";
import * as V1 from "../../_relations.js";
import { QueryPromise } from "../../query-promise.js";

//#region src/mysql-core/query-builders/_query.ts
var _RelationalQueryBuilder = class {
	static [entityKind] = "MySqlRelationalQueryBuilder";
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
var MySqlRelationalQuery = class extends QueryPromise {
	static [entityKind] = "MySqlRelationalQuery";
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
			const rows = rawRows.map((row) => V1.mapRelationalRow(this.schema, this.tableConfig, row, query.selection));
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
export { MySqlRelationalQuery, _RelationalQueryBuilder };
//# sourceMappingURL=_query.js.map