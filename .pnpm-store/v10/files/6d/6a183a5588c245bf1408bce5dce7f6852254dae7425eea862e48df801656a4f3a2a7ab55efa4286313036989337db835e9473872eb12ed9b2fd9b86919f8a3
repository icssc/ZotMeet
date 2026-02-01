const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_utils = require('../utils.cjs');
const require_mysql_core_query_builders_query_builder = require('./query-builder.cjs');
let __entity_ts = require("../../entity.cjs");
let __table_ts = require("../../table.cjs");
let __utils_ts = require("../../utils.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/mysql-core/query-builders/insert.ts
var MySqlInsertBuilder = class {
	static [__entity_ts.entityKind] = "MySqlInsertBuilder";
	shouldIgnore = false;
	constructor(table, session, dialect) {
		this.table = table;
		this.session = session;
		this.dialect = dialect;
	}
	ignore() {
		this.shouldIgnore = true;
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
		return new MySqlInsertBase(this.table, mappedValues, this.shouldIgnore, this.session, this.dialect);
	}
	select(selectQuery) {
		const select = typeof selectQuery === "function" ? selectQuery(new require_mysql_core_query_builders_query_builder.QueryBuilder()) : selectQuery;
		if (!(0, __entity_ts.is)(select, __sql_sql_ts.SQL) && !(0, __utils_ts.haveSameKeys)(this.table[__table_ts.TableColumns], select._.selectedFields)) throw new Error("Insert select error: selected fields are not the same or are in a different order compared to the table definition");
		return new MySqlInsertBase(this.table, select, this.shouldIgnore, this.session, this.dialect, true);
	}
};
var MySqlInsertBase = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "MySqlInsert";
	config;
	cacheConfig;
	constructor(table, values, ignore, session, dialect, select) {
		super();
		this.session = session;
		this.dialect = dialect;
		this.config = {
			table,
			values,
			select,
			ignore
		};
	}
	/**
	* Adds an `on duplicate key update` clause to the query.
	*
	* Calling this method will update the row if any unique index conflicts. MySQL will automatically determine the conflict target based on the primary key and unique indexes.
	*
	* See docs: {@link https://orm.drizzle.team/docs/insert#on-duplicate-key-update}
	*
	* @param config The `set` clause
	*
	* @example
	* ```ts
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW'})
	*   .onDuplicateKeyUpdate({ set: { brand: 'Porsche' }});
	* ```
	*
	* While MySQL does not directly support doing nothing on conflict, you can perform a no-op by setting any column's value to itself and achieve the same effect:
	*
	* ```ts
	* import { sql } from 'drizzle-orm';
	*
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onDuplicateKeyUpdate({ set: { id: sql`id` } });
	* ```
	*/
	onDuplicateKeyUpdate(config) {
		const setSql = this.dialect.buildUpdateSet(this.config.table, (0, __utils_ts.mapUpdateSet)(this.config.table, config.set));
		this.config.onConflict = __sql_sql_ts.sql`update ${setSql}`;
		return this;
	}
	$returningId() {
		const returning = [];
		for (const [key, value] of Object.entries(this.config.table[__table_ts.Table.Symbol.Columns])) if (value.primary) returning.push({
			field: value,
			path: [key]
		});
		this.config.returning = returning;
		return this;
	}
	/** @internal */
	getSQL() {
		return this.dialect.buildInsertQuery(this.config).sql;
	}
	toSQL() {
		const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
		return rest;
	}
	prepare() {
		const { sql: sql$1, generatedIds } = this.dialect.buildInsertQuery(this.config);
		return this.session.prepareQuery(this.dialect.sqlToQuery(sql$1), void 0, void 0, generatedIds, this.config.returning, {
			type: "insert",
			tables: require_mysql_core_utils.extractUsedTable(this.config.table)
		}, this.cacheConfig);
	}
	execute = (placeholderValues) => {
		return this.prepare().execute(placeholderValues);
	};
	createIterator = () => {
		const self = this;
		return async function* (placeholderValues) {
			yield* self.prepare().iterator(placeholderValues);
		};
	};
	iterator = this.createIterator();
	$dynamic() {
		return this;
	}
};

//#endregion
exports.MySqlInsertBase = MySqlInsertBase;
exports.MySqlInsertBuilder = MySqlInsertBuilder;
//# sourceMappingURL=insert.cjs.map