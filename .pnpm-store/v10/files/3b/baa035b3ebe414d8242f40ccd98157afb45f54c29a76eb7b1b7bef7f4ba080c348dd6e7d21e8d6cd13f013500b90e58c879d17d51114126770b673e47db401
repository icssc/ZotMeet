import { entityKind } from "../../entity.js";
import { sql } from "../../sql/sql.js";
import { QueryPromise } from "../../query-promise.js";
import { mapRelationalRow } from "../../relations.js";

//#region src/sqlite-core/query-builders/query.ts
var RelationalQueryBuilder = class {
	static [entityKind] = "SQLiteAsyncRelationalQueryBuilderV2";
	constructor(mode, schema, table, tableConfig, dialect, session, rowMode, forbidJsonb) {
		this.mode = mode;
		this.schema = schema;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
		this.rowMode = rowMode;
		this.forbidJsonb = forbidJsonb;
	}
	findMany(config) {
		return this.mode === "sync" ? new SQLiteSyncRelationalQuery(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "many", this.rowMode, this.forbidJsonb) : new SQLiteRelationalQuery(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "many", this.rowMode, this.forbidJsonb);
	}
	findFirst(config) {
		return this.mode === "sync" ? new SQLiteSyncRelationalQuery(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "first", this.rowMode, this.forbidJsonb) : new SQLiteRelationalQuery(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "first", this.rowMode, this.forbidJsonb);
	}
};
var SQLiteRelationalQuery = class extends QueryPromise {
	static [entityKind] = "SQLiteAsyncRelationalQueryV2";
	/** @internal */
	mode;
	/** @internal */
	table;
	constructor(schema, table, tableConfig, dialect, session, config, mode, rowMode, forbidJsonb) {
		super();
		this.schema = schema;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
		this.config = config;
		this.rowMode = rowMode;
		this.forbidJsonb = forbidJsonb;
		this.mode = mode;
		this.table = table;
	}
	/** @internal */
	getSQL() {
		return this.dialect.buildRelationalQuery({
			schema: this.schema,
			table: this.table,
			tableConfig: this.tableConfig,
			queryConfig: this.config,
			mode: this.mode,
			jsonb: this.forbidJsonb ? sql`json` : sql`jsonb`
		}).sql;
	}
	/** @internal */
	_prepare(isOneTimeQuery = true) {
		const { query, builtQuery } = this._toSQL();
		return this.session[isOneTimeQuery ? "prepareOneTimeRelationalQuery" : "prepareRelationalQuery"](builtQuery, void 0, this.mode === "first" ? "get" : "all", (rawRows, mapColumnValue) => {
			const rows = rawRows.map((row) => mapRelationalRow(row, query.selection, mapColumnValue, !this.rowMode));
			if (this.mode === "first") return rows[0];
			return rows;
		});
	}
	prepare() {
		return this._prepare(false);
	}
	_getQuery() {
		const jsonb = this.forbidJsonb ? sql`json` : sql`jsonb`;
		const query = this.dialect.buildRelationalQuery({
			schema: this.schema,
			table: this.table,
			tableConfig: this.tableConfig,
			queryConfig: this.config,
			mode: this.mode,
			isNested: this.rowMode,
			jsonb
		});
		if (this.rowMode) query.sql = sql`select json_object(${sql.join(query.selection.map((s) => {
			return sql`${sql.raw(this.dialect.escapeString(s.key))}, ${s.selection ? sql`${jsonb}(${sql.identifier(s.key)})` : sql.identifier(s.key)}`;
		}), sql`, `)}) as ${sql.identifier("r")} from (${query.sql}) as ${sql.identifier("t")}`;
		return query;
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
	/** @internal */
	executeRaw() {
		if (this.mode === "first") return this._prepare().get();
		return this._prepare().all();
	}
	async execute() {
		return this.executeRaw();
	}
};
var SQLiteSyncRelationalQuery = class extends SQLiteRelationalQuery {
	static [entityKind] = "SQLiteSyncRelationalQueryV2";
	sync() {
		return this.executeRaw();
	}
};

//#endregion
export { RelationalQueryBuilder, SQLiteRelationalQuery, SQLiteSyncRelationalQuery };
//# sourceMappingURL=query.js.map