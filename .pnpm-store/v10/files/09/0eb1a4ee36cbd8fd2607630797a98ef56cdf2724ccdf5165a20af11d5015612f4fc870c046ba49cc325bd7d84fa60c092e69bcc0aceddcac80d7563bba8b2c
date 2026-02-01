const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_utils = require('../utils.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __table_ts = require("../../table.cjs");
let __utils_ts = require("../../utils.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/gel-core/query-builders/delete.ts
var GelDeleteBase = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "GelDelete";
	config;
	constructor(table, session, dialect, withList) {
		super();
		this.session = session;
		this.dialect = dialect;
		this.config = {
			table,
			withList
		};
	}
	/**
	* Adds a `where` clause to the query.
	*
	* Calling this method will delete only those rows that fulfill a specified condition.
	*
	* See docs: {@link https://orm.drizzle.team/docs/delete}
	*
	* @param where the `where` clause.
	*
	* @example
	* You can use conditional operators and `sql function` to filter the rows to be deleted.
	*
	* ```ts
	* // Delete all cars with green color
	* await db.delete(cars).where(eq(cars.color, 'green'));
	* // or
	* await db.delete(cars).where(sql`${cars.color} = 'green'`)
	* ```
	*
	* You can logically combine conditional operators with `and()` and `or()` operators:
	*
	* ```ts
	* // Delete all BMW cars with a green color
	* await db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
	*
	* // Delete all cars with the green or blue color
	* await db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
	* ```
	*/
	where(where) {
		this.config.where = where;
		return this;
	}
	returning(fields = this.config.table[__table_ts.Table.Symbol.Columns]) {
		this.config.returning = (0, __utils_ts.orderSelectedFields)(fields);
		return this;
	}
	/** @internal */
	getSQL() {
		return this.dialect.buildDeleteQuery(this.config);
	}
	toSQL() {
		const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
		return rest;
	}
	/** @internal */
	_prepare(name) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
				type: "delete",
				tables: require_gel_core_utils.extractUsedTable(this.config.table)
			});
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	execute = (placeholderValues) => {
		return __tracing_ts.tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	};
	$dynamic() {
		return this;
	}
};

//#endregion
exports.GelDeleteBase = GelDeleteBase;
//# sourceMappingURL=delete.cjs.map