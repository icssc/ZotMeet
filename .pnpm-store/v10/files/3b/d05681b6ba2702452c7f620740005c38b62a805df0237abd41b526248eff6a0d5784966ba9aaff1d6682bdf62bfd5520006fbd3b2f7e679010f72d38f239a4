import { MySqlColumn } from "../columns/common.cjs";
import { SelectedFieldsOrdered } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { InferInsertModel } from "../../table.cjs";
import { UpdateSet, ValueOrArray } from "../../utils.cjs";
import { GetColumnData } from "../../column.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { WithCacheConfig } from "../../cache/core/types.cjs";
import { MySqlTable } from "../table.cjs";
import { MySqlDialect } from "../dialect.cjs";
import { AnyMySqlQueryResultHKT, MySqlPreparedQueryConfig, MySqlQueryResultHKT, MySqlQueryResultKind, MySqlSession, PreparedQueryHKTBase, PreparedQueryKind } from "../session.cjs";

//#region src/mysql-core/query-builders/update.d.ts
interface MySqlUpdateConfig {
  where?: SQL | undefined;
  limit?: number | Placeholder;
  orderBy?: (MySqlColumn | SQL | SQL.Aliased)[];
  set: UpdateSet;
  table: MySqlTable;
  returning?: SelectedFieldsOrdered;
  withList?: Subquery[];
}
type MySqlUpdateSetSource<TTable extends MySqlTable, TModel extends Record<string, any> = InferInsertModel<TTable>> = { [Key in keyof TModel & string]?: GetColumnData<TTable['_']['columns'][Key], 'query'> | SQL | Placeholder | undefined } & {};
declare class MySqlUpdateBuilder<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase> {
  private table;
  private session;
  private dialect;
  private withList?;
  static readonly [entityKind]: string;
  readonly _: {
    readonly table: TTable;
  };
  constructor(table: TTable, session: MySqlSession, dialect: MySqlDialect, withList?: Subquery[] | undefined);
  set(values: MySqlUpdateSetSource<TTable>): MySqlUpdateBase<TTable, TQueryResult, TPreparedQueryHKT>;
}
type MySqlUpdateWithout<T extends AnyMySqlUpdateBase, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<MySqlUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
type MySqlUpdatePrepare<T extends AnyMySqlUpdateBase> = PreparedQueryKind<T['_']['preparedQueryHKT'], MySqlPreparedQueryConfig & {
  execute: MySqlQueryResultKind<T['_']['queryResult'], never>;
  iterator: never;
}, true>;
type MySqlUpdateDynamic<T extends AnyMySqlUpdateBase> = MySqlUpdate<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT']>;
type MySqlUpdate<TTable extends MySqlTable = MySqlTable, TQueryResult extends MySqlQueryResultHKT = AnyMySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase> = MySqlUpdateBase<TTable, TQueryResult, TPreparedQueryHKT, true, never>;
type AnyMySqlUpdateBase = MySqlUpdateBase<any, any, any, any, any>;
interface MySqlUpdateBase<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<MySqlQueryResultKind<TQueryResult, never>>, SQLWrapper {
  readonly _: {
    readonly table: TTable;
    readonly queryResult: TQueryResult;
    readonly preparedQueryHKT: TPreparedQueryHKT;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
  };
}
declare class MySqlUpdateBase<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<MySqlQueryResultKind<TQueryResult, never>> implements SQLWrapper {
  private session;
  private dialect;
  static readonly [entityKind]: string;
  private config;
  protected cacheConfig?: WithCacheConfig;
  constructor(table: TTable, set: UpdateSet, session: MySqlSession, dialect: MySqlDialect, withList?: Subquery[]);
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
  where(where: SQL | undefined): MySqlUpdateWithout<this, TDynamic, 'where'>;
  orderBy(builder: (updateTable: TTable) => ValueOrArray<MySqlColumn | SQL | SQL.Aliased>): MySqlUpdateWithout<this, TDynamic, 'orderBy'>;
  orderBy(...columns: (MySqlColumn | SQL | SQL.Aliased)[]): MySqlUpdateWithout<this, TDynamic, 'orderBy'>;
  limit(limit: number | Placeholder): MySqlUpdateWithout<this, TDynamic, 'limit'>;
  toSQL(): Query;
  prepare(): MySqlUpdatePrepare<this>;
  execute: ReturnType<this['prepare']>['execute'];
  private createIterator;
  iterator: ReturnType<this["prepare"]>["iterator"];
  $dynamic(): MySqlUpdateDynamic<this>;
}
//#endregion
export { AnyMySqlUpdateBase, MySqlUpdate, MySqlUpdateBase, MySqlUpdateBuilder, MySqlUpdateConfig, MySqlUpdateDynamic, MySqlUpdatePrepare, MySqlUpdateSetSource, MySqlUpdateWithout };
//# sourceMappingURL=update.d.cts.map