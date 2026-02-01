const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_utils = require('../utils.cjs');
const require_gel_core_query_builders_query_builder = require('./query-builder.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __table_ts = require("../../table.cjs");
let __utils_ts = require("../../utils.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/gel-core/query-builders/insert.ts
var GelInsertBuilder = class {
	static [__entity_ts.entityKind] = "GelInsertBuilder";
	constructor(table, session, dialect, withList, overridingSystemValue_) {
		this.table = table;
		this.session = session;
		this.dialect = dialect;
		this.withList = withList;
		this.overridingSystemValue_ = overridingSystemValue_;
	}
	authToken;
	/** @internal */
	setToken(token) {
		this.authToken = token;
		return this;
	}
	overridingSystemValue() {
		this.overridingSystemValue_ = true;
		return this;
	}
	values(values) {
		values = Array.isArray(values) ? values : [values];
		if (values.length === 0) throw new Error("values() must be called with at least one value");
		const mappedValues = values.map((entry) => {
			const result = {};
			const cols = this.table[__table_ts.Table.Symbol.Columns];
			for (const colKey of Object.keys(entry)) {
				const colValue = entry[colKey];
				result[colKey] = (0, __entity_ts.is)(colValue, __sql_sql_ts.SQL) ? colValue : new __sql_sql_ts.Param(colValue, cols[colKey]);
			}
			return result;
		});
		return new GelInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList, false, this.overridingSystemValue_);
	}
	select(selectQuery) {
		const select = typeof selectQuery === "function" ? selectQuery(new require_gel_core_query_builders_query_builder.QueryBuilder()) : selectQuery;
		if (!(0, __entity_ts.is)(select, __sql_sql_ts.SQL) && !(0, __utils_ts.haveSameKeys)(this.table[__table_ts.TableColumns], select._.selectedFields)) throw new Error("Insert select error: selected fields are not the same or are in a different order compared to the table definition");
		return new GelInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
	}
};
var GelInsertBase = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "GelInsert";
	config;
	constructor(table, values, session, dialect, withList, select, overridingSystemValue_) {
		super();
		this.session = session;
		this.dialect = dialect;
		this.config = {
			table,
			values,
			withList,
			select,
			overridingSystemValue_
		};
	}
	returning(fields = this.config.table[__table_ts.Table.Symbol.Columns]) {
		this.config.returning = (0, __utils_ts.orderSelectedFields)(fields);
		return this;
	}
	/**
	* Adds an `on conflict do nothing` clause to the query.
	*
	* Calling this method simply avoids inserting a row as its alternative action.
	*
	* See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
	*
	* @param config The `target` and `where` clauses.
	*
	* @example
	* ```ts
	* // Insert one row and cancel the insert if there's a conflict
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoNothing();
	*
	* // Explicitly specify conflict target
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoNothing({ target: cars.id });
	* ```
	*/
	/**
	* Adds an `on conflict do update` clause to the query.
	*
	* Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
	*
	* See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
	*
	* @param config The `target`, `set` and `where` clauses.
	*
	* @example
	* ```ts
	* // Update the row if there's a conflict
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoUpdate({
	*     target: cars.id,
	*     set: { brand: 'Porsche' }
	*   });
	*
	* // Upsert with 'where' clause
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoUpdate({
	*     target: cars.id,
	*     set: { brand: 'newBMW' },
	*     targetWhere: sql`${cars.createdAt} > '2023-01-01'::date`,
	*   });
	* ```
	*/
	/** @internal */
	getSQL() {
		return this.dialect.buildInsertQuery(this.config);
	}
	toSQL() {
		const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
		return rest;
	}
	/** @internal */
	_prepare(name) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
				type: "insert",
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
exports.GelInsertBase = GelInsertBase;
exports.GelInsertBuilder = GelInsertBuilder;
//# sourceMappingURL=insert.cjs.map