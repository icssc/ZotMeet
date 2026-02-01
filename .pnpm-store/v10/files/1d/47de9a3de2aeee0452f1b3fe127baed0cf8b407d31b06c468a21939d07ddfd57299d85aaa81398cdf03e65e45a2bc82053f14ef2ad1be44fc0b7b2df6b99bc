import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import { mapRelationalRow } from "../../relations.js";

//#region src/mysql-core/query-builders/query.ts
var RelationalQueryBuilder = class {
	static [entityKind] = "MySqlRelationalQueryBuilderV2";
	constructor(schema, table, tableConfig, dialect, session) {
		this.schema = schema;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
	}
	findMany(config) {
		return new MySqlRelationalQuery(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "many");
	}
	findFirst(config) {
		return new MySqlRelationalQuery(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "first");
	}
};
var MySqlRelationalQuery = class extends QueryPromise {
	static [entityKind] = "MySqlRelationalQueryV2";
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
	prepare() {
		const { query, builtQuery } = this._toSQL();
		return this.session.prepareRelationalQuery(builtQuery, void 0, (rawRows) => {
			const rows = rawRows.map((row) => mapRelationalRow(row, query.selection));
			if (this.mode === "first") return rows[0];
			return rows;
		});
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
export { MySqlRelationalQuery, RelationalQueryBuilder };
//# sourceMappingURL=query.js.map