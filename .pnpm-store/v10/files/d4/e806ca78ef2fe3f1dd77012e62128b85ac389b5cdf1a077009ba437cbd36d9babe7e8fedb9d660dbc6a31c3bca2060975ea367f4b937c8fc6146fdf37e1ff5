const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_sqlite_core_view_base = require('../view-base.cjs');
const require_sqlite_core_utils = require('../utils.cjs');
let __entity_ts = require("../../entity.cjs");
let __subquery_ts = require("../../subquery.cjs");
let __view_common_ts = require("../../view-common.cjs");
let __table_ts = require("../../table.cjs");
let __utils_ts = require("../../utils.cjs");
let __selection_proxy_ts = require("../../selection-proxy.cjs");
let __query_promise_ts = require("../../query-promise.cjs");
let __sqlite_core_table_ts = require("../table.cjs");

//#region src/sqlite-core/query-builders/update.ts
var SQLiteUpdateBuilder = class {
	static [__entity_ts.entityKind] = "SQLiteUpdateBuilder";
	constructor(table, session, dialect, withList) {
		this.table = table;
		this.session = session;
		this.dialect = dialect;
		this.withList = withList;
	}
	set(values) {
		return new SQLiteUpdateBase(this.table, (0, __utils_ts.mapUpdateSet)(this.table, values), this.session, this.dialect, this.withList);
	}
};
var SQLiteUpdateBase = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "SQLiteUpdate";
	/** @internal */
	config;
	constructor(table, set, session, dialect, withList) {
		super();
		this.session = session;
		this.dialect = dialect;
		this.config = {
			set,
			table,
			withList,
			joins: []
		};
	}
	from(source) {
		this.config.from = source;
		return this;
	}
	createJoin(joinType) {
		return ((table, on) => {
			const tableName = (0, __utils_ts.getTableLikeName)(table);
			if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) throw new Error(`Alias "${tableName}" is already used in this query`);
			if (typeof on === "function") {
				const from = this.config.from ? (0, __entity_ts.is)(table, __sqlite_core_table_ts.SQLiteTable) ? table[__table_ts.Table.Symbol.Columns] : (0, __entity_ts.is)(table, __subquery_ts.Subquery) ? table._.selectedFields : (0, __entity_ts.is)(table, require_sqlite_core_view_base.SQLiteViewBase) ? table[__view_common_ts.ViewBaseConfig].selectedFields : void 0 : void 0;
				on = on(new Proxy(this.config.table[__table_ts.Table.Symbol.Columns], new __selection_proxy_ts.SelectionProxyHandler({
					sqlAliasedBehavior: "sql",
					sqlBehavior: "sql"
				})), from && new Proxy(from, new __selection_proxy_ts.SelectionProxyHandler({
					sqlAliasedBehavior: "sql",
					sqlBehavior: "sql"
				})));
			}
			this.config.joins.push({
				on,
				table,
				joinType,
				alias: tableName
			});
			return this;
		});
	}
	leftJoin = this.createJoin("left");
	rightJoin = this.createJoin("right");
	innerJoin = this.createJoin("inner");
	fullJoin = this.createJoin("full");
	/**
	* Adds a 'where' clause to the query.
	*
	* Calling this method will update only those rows that fulfill a specified condition.
	*
	* See docs: {@link https://orm.drizzle.team/docs/update}
	*
	* @param where the 'where' clause.
	*
	* @example
	* You can use conditional operators and `sql function` to filter the rows to be updated.
	*
	* ```ts
	* // Update all cars with green color
	* db.update(cars).set({ color: 'red' })
	*   .where(eq(cars.color, 'green'));
	* // or
	* db.update(cars).set({ color: 'red' })
	*   .where(sql`${cars.color} = 'green'`)
	* ```
	*
	* You can logically combine conditional operators with `and()` and `or()` operators:
	*
	* ```ts
	* // Update all BMW cars with a green color
	* db.update(cars).set({ color: 'red' })
	*   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
	*
	* // Update all cars with the green or blue color
	* db.update(cars).set({ color: 'red' })
	*   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
	* ```
	*/
	where(where) {
		this.config.where = where;
		return this;
	}
	orderBy(...columns) {
		if (typeof columns[0] === "function") {
			const orderBy = columns[0](new Proxy(this.config.table[__table_ts.Table.Symbol.Columns], new __selection_proxy_ts.SelectionProxyHandler({
				sqlAliasedBehavior: "alias",
				sqlBehavior: "sql"
			})));
			const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
			this.config.orderBy = orderByArray;
		} else {
			const orderByArray = columns;
			this.config.orderBy = orderByArray;
		}
		return this;
	}
	limit(limit) {
		this.config.limit = limit;
		return this;
	}
	returning(fields = this.config.table[__sqlite_core_table_ts.SQLiteTable.Symbol.Columns]) {
		this.config.returning = (0, __utils_ts.orderSelectedFields)(fields);
		return this;
	}
	/** @internal */
	getSQL() {
		return this.dialect.buildUpdateQuery(this.config);
	}
	toSQL() {
		const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
		return rest;
	}
	/** @internal */
	_prepare(isOneTimeQuery = true) {
		return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](this.dialect.sqlToQuery(this.getSQL()), this.config.returning, this.config.returning ? "all" : "run", true, void 0, {
			type: "insert",
			tables: require_sqlite_core_utils.extractUsedTable(this.config.table)
		});
	}
	prepare() {
		return this._prepare(false);
	}
	run = (placeholderValues) => {
		return this._prepare().run(placeholderValues);
	};
	all = (placeholderValues) => {
		return this._prepare().all(placeholderValues);
	};
	get = (placeholderValues) => {
		return this._prepare().get(placeholderValues);
	};
	values = (placeholderValues) => {
		return this._prepare().values(placeholderValues);
	};
	async execute() {
		return this.config.returning ? this.all() : this.run();
	}
	$dynamic() {
		return this;
	}
};

//#endregion
exports.SQLiteUpdateBase = SQLiteUpdateBase;
exports.SQLiteUpdateBuilder = SQLiteUpdateBuilder;
//# sourceMappingURL=update.cjs.map