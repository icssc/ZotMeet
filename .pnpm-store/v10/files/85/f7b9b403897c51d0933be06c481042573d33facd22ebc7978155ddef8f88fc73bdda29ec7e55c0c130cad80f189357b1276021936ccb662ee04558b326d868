import { entityKind, is } from "../../entity.js";
import { Subquery } from "../../subquery.js";
import { ViewBaseConfig } from "../../view-common.js";
import { Table, getTableName } from "../../table.js";
import { getTableLikeName, mapUpdateSet, orderSelectedFields } from "../../utils.js";
import { SQL } from "../../sql/sql.js";
import { SelectionProxyHandler } from "../../selection-proxy.js";
import { PgTable } from "../table.js";

//#region src/pg-core/query-builders/update.ts
var PgUpdateBuilder = class {
	static [entityKind] = "PgUpdateBuilder";
	constructor(table, session, dialect, withList, builder = PgUpdateBase) {
		this.table = table;
		this.session = session;
		this.dialect = dialect;
		this.withList = withList;
		this.builder = builder;
	}
	/** @internal */
	authToken;
	/** @internal */
	setToken(token) {
		this.authToken = token;
		return this;
	}
	set(values) {
		const builder = new this.builder(this.table, mapUpdateSet(this.table, values), this.session, this.dialect, this.withList);
		if ("setToken" in builder) builder.setToken(this.authToken);
		return builder;
	}
};
var PgUpdateBase = class {
	static [entityKind] = "PgUpdate";
	config;
	tableName;
	joinsNotNullableMap;
	cacheConfig;
	constructor(table, set, session, dialect, withList) {
		this.session = session;
		this.dialect = dialect;
		this.config = {
			set,
			table,
			withList,
			joins: []
		};
		this.tableName = getTableLikeName(table);
		this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
	}
	from(source) {
		const src = source;
		const tableName = getTableLikeName(src);
		if (typeof tableName === "string") this.joinsNotNullableMap[tableName] = true;
		this.config.from = src;
		return this;
	}
	getTableLikeFields(table) {
		if (is(table, PgTable)) return table[Table.Symbol.Columns];
		else if (is(table, Subquery)) return table._.selectedFields;
		return table[ViewBaseConfig].selectedFields;
	}
	createJoin(joinType) {
		return ((table, on) => {
			const tableName = getTableLikeName(table);
			if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) throw new Error(`Alias "${tableName}" is already used in this query`);
			if (typeof on === "function") {
				const from = this.config.from && !is(this.config.from, SQL) ? this.getTableLikeFields(this.config.from) : void 0;
				on = on(new Proxy(this.config.table[Table.Symbol.Columns], new SelectionProxyHandler({
					sqlAliasedBehavior: "sql",
					sqlBehavior: "sql"
				})), from && new Proxy(from, new SelectionProxyHandler({
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
			if (typeof tableName === "string") switch (joinType) {
				case "left":
					this.joinsNotNullableMap[tableName] = false;
					break;
				case "right":
					this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
					this.joinsNotNullableMap[tableName] = true;
					break;
				case "inner":
					this.joinsNotNullableMap[tableName] = true;
					break;
				case "full":
					this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
					this.joinsNotNullableMap[tableName] = false;
					break;
			}
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
	* await db.update(cars).set({ color: 'red' })
	*   .where(eq(cars.color, 'green'));
	* // or
	* await db.update(cars).set({ color: 'red' })
	*   .where(sql`${cars.color} = 'green'`)
	* ```
	*
	* You can logically combine conditional operators with `and()` and `or()` operators:
	*
	* ```ts
	* // Update all BMW cars with a green color
	* await db.update(cars).set({ color: 'red' })
	*   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
	*
	* // Update all cars with the green or blue color
	* await db.update(cars).set({ color: 'red' })
	*   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
	* ```
	*/
	where(where) {
		this.config.where = where;
		return this;
	}
	returning(fields) {
		if (!fields) {
			fields = Object.assign({}, this.config.table[Table.Symbol.Columns]);
			if (this.config.from) {
				const tableName = getTableLikeName(this.config.from);
				if (typeof tableName === "string" && this.config.from && !is(this.config.from, SQL)) {
					const fromFields = this.getTableLikeFields(this.config.from);
					fields[tableName] = fromFields;
				}
				for (const join of this.config.joins) {
					const tableName$1 = getTableLikeName(join.table);
					if (typeof tableName$1 === "string" && !is(join.table, SQL)) {
						const fromFields = this.getTableLikeFields(join.table);
						fields[tableName$1] = fromFields;
					}
				}
			}
		}
		this.config.returningFields = fields;
		this.config.returning = orderSelectedFields(fields);
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
	getSelectedFields() {
		return this.config.returningFields ? new Proxy(this.config.returningFields, new SelectionProxyHandler({
			alias: getTableName(this.config.table),
			sqlAliasedBehavior: "alias",
			sqlBehavior: "error"
		})) : void 0;
	}
	$dynamic() {
		return this;
	}
};

//#endregion
export { PgUpdateBase, PgUpdateBuilder };
//# sourceMappingURL=update.js.map