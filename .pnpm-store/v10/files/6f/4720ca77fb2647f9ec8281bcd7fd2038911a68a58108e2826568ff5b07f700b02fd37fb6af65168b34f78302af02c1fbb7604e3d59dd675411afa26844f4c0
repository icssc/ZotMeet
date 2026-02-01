import { AnyMySqlColumn } from "../columns/common.cjs";
import { QueryBuilder } from "./query-builder.cjs";
import { MySqlUpdateSetSource } from "./update.cjs";
import { SelectedFieldsOrdered } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { Param, Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { InferInsertModel, InferModelFromColumns } from "../../table.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";
import { WithCacheConfig } from "../../cache/core/types.cjs";
import { MySqlTable } from "../table.cjs";
import { MySqlDialect } from "../dialect.cjs";
import { AnyMySqlQueryResultHKT, MySqlPreparedQueryConfig, MySqlQueryResultHKT, MySqlQueryResultKind, MySqlSession, PreparedQueryHKTBase, PreparedQueryKind } from "../session.cjs";

//#region src/mysql-core/query-builders/insert.d.ts
interface MySqlInsertConfig<TTable extends MySqlTable = MySqlTable> {
  table: TTable;
  values: Record<string, Param | SQL>[] | MySqlInsertSelectQueryBuilder<TTable> | SQL;
  ignore: boolean;
  onConflict?: SQL;
  returning?: SelectedFieldsOrdered;
  select?: boolean;
}
type AnyMySqlInsertConfig = MySqlInsertConfig<MySqlTable>;
type MySqlInsertValue<TTable extends MySqlTable, TModel extends Record<string, any> = InferInsertModel<TTable>> = { [Key in keyof TModel]: TModel[Key] | SQL | Placeholder } & {};
type MySqlInsertSelectQueryBuilder<TTable extends MySqlTable, TModel extends Record<string, any> = InferInsertModel<TTable>> = TypedQueryBuilder<{ [K in keyof TModel]: AnyMySqlColumn | SQL | SQL.Aliased | TModel[K] }>;
declare class MySqlInsertBuilder<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase> {
  private table;
  private session;
  private dialect;
  static readonly [entityKind]: string;
  private shouldIgnore;
  constructor(table: TTable, session: MySqlSession, dialect: MySqlDialect);
  ignore(): this;
  values(value: MySqlInsertValue<TTable>): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
  values(values: MySqlInsertValue<TTable>[]): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
  select(selectQuery: (qb: QueryBuilder) => MySqlInsertSelectQueryBuilder<TTable>): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
  select(selectQuery: (qb: QueryBuilder) => SQL): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
  select(selectQuery: SQL): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
  select(selectQuery: MySqlInsertSelectQueryBuilder<TTable>): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
}
type MySqlInsertWithout<T extends AnyMySqlInsert, TDynamic extends boolean, K$1 extends keyof T & string> = TDynamic extends true ? T : Omit<MySqlInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | '$returning'>, T['_']['excludedMethods'] | K$1>;
type MySqlInsertDynamic<T extends AnyMySqlInsert> = MySqlInsert<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['returning']>;
type MySqlInsertPrepare<T extends AnyMySqlInsert, TReturning extends Record<string, unknown> | undefined = undefined> = PreparedQueryKind<T['_']['preparedQueryHKT'], MySqlPreparedQueryConfig & {
  execute: TReturning extends undefined ? MySqlQueryResultKind<T['_']['queryResult'], never> : TReturning[];
  iterator: never;
}, true>;
type MySqlInsertOnDuplicateKeyUpdateConfig<T extends AnyMySqlInsert> = {
  set: MySqlUpdateSetSource<T['_']['table']>;
};
type MySqlInsert<TTable extends MySqlTable = MySqlTable, TQueryResult extends MySqlQueryResultHKT = AnyMySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT, TReturning, true, never>;
type MySqlInsertReturning<T extends AnyMySqlInsert, TDynamic extends boolean> = MySqlInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], InferModelFromColumns<GetPrimarySerialOrDefaultKeys<T['_']['table']['_']['columns']>>, TDynamic, T['_']['excludedMethods'] | '$returning'>;
type AnyMySqlInsert = MySqlInsertBase<any, any, any, any, any, any>;
interface MySqlInsertBase<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? MySqlQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? MySqlQueryResultKind<TQueryResult, never> : TReturning[], 'mysql'>, SQLWrapper {
  readonly _: {
    readonly dialect: 'mysql';
    readonly table: TTable;
    readonly queryResult: TQueryResult;
    readonly preparedQueryHKT: TPreparedQueryHKT;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
    readonly returning: TReturning;
    readonly result: TReturning extends undefined ? MySqlQueryResultKind<TQueryResult, never> : TReturning[];
  };
}
type PrimaryKeyKeys<T extends Record<string, AnyMySqlColumn>> = { [K in keyof T]: T[K]['_']['isPrimaryKey'] extends true ? T[K]['_']['isAutoincrement'] extends true ? K : T[K]['_']['hasRuntimeDefault'] extends true ? T[K]['_']['isPrimaryKey'] extends true ? K : never : never : T[K]['_']['hasRuntimeDefault'] extends true ? T[K]['_']['isPrimaryKey'] extends true ? K : never : never }[keyof T];
type GetPrimarySerialOrDefaultKeys<T extends Record<string, AnyMySqlColumn>> = { [K in PrimaryKeyKeys<T>]: T[K] };
declare class MySqlInsertBase<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? MySqlQueryResultKind<TQueryResult, never> : TReturning[]> implements RunnableQuery<TReturning extends undefined ? MySqlQueryResultKind<TQueryResult, never> : TReturning[], 'mysql'>, SQLWrapper {
  private session;
  private dialect;
  static readonly [entityKind]: string;
  protected $table: TTable;
  private config;
  protected cacheConfig?: WithCacheConfig;
  constructor(table: TTable, values: MySqlInsertConfig['values'], ignore: boolean, session: MySqlSession, dialect: MySqlDialect, select?: boolean);
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
  onDuplicateKeyUpdate(config: MySqlInsertOnDuplicateKeyUpdateConfig<this>): MySqlInsertWithout<this, TDynamic, 'onDuplicateKeyUpdate'>;
  $returningId(): MySqlInsertWithout<MySqlInsertReturning<this, TDynamic>, TDynamic, '$returningId'>;
  toSQL(): Query;
  prepare(): MySqlInsertPrepare<this, TReturning>;
  execute: ReturnType<this['prepare']>['execute'];
  private createIterator;
  iterator: ReturnType<this["prepare"]>["iterator"];
  $dynamic(): MySqlInsertDynamic<this>;
}
//#endregion
export { AnyMySqlInsert, AnyMySqlInsertConfig, GetPrimarySerialOrDefaultKeys, MySqlInsert, MySqlInsertBase, MySqlInsertBuilder, MySqlInsertConfig, MySqlInsertDynamic, MySqlInsertOnDuplicateKeyUpdateConfig, MySqlInsertPrepare, MySqlInsertReturning, MySqlInsertSelectQueryBuilder, MySqlInsertValue, MySqlInsertWithout, PrimaryKeyKeys };
//# sourceMappingURL=insert.d.cts.map