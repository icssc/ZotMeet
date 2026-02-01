import { AnyGelColumn } from "../columns/common.cjs";
import { QueryBuilder } from "./query-builder.cjs";
import { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
import { GelUpdateSetSource } from "./update.cjs";
import { entityKind } from "../../entity.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { SelectResultFields } from "../../query-builders/select.types.cjs";
import { Param, Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { InferInsertModel } from "../../table.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";
import { GelTable, TableConfig as TableConfig$1 } from "../table.cjs";
import { GelDialect } from "../dialect.cjs";
import { GelPreparedQuery, GelQueryResultHKT, GelQueryResultKind, GelSession, PreparedQueryConfig } from "../session.cjs";
import { IndexColumn } from "../indexes.cjs";

//#region src/gel-core/query-builders/insert.d.ts
interface GelInsertConfig<TTable extends GelTable = GelTable> {
  table: TTable;
  values: Record<string, Param | SQL>[] | GelInsertSelectQueryBuilder<TTable> | SQL;
  withList?: Subquery[];
  onConflict?: SQL;
  returning?: SelectedFieldsOrdered;
  select?: boolean;
  overridingSystemValue_?: boolean;
}
type GelInsertValue<TTable extends GelTable<TableConfig$1>, OverrideT extends boolean = false, TModel extends Record<string, any> = InferInsertModel<TTable, {
  dbColumnNames: false;
  override: OverrideT;
}>> = { [Key in keyof TModel]: TModel[Key] | SQL | Placeholder } & {};
type GelInsertSelectQueryBuilder<TTable extends GelTable, TModel extends Record<string, any> = InferInsertModel<TTable>> = TypedQueryBuilder<{ [K in keyof TModel]: AnyGelColumn | SQL | SQL.Aliased | TModel[K] }>;
declare class GelInsertBuilder<TTable extends GelTable, TQueryResult extends GelQueryResultHKT, OverrideT extends boolean = false> {
  private table;
  private session;
  private dialect;
  private withList?;
  private overridingSystemValue_?;
  static readonly [entityKind]: string;
  constructor(table: TTable, session: GelSession, dialect: GelDialect, withList?: Subquery[] | undefined, overridingSystemValue_?: boolean | undefined);
  private authToken?;
  overridingSystemValue(): Omit<GelInsertBuilder<TTable, TQueryResult, true>, 'overridingSystemValue'>;
  values(value: GelInsertValue<TTable, OverrideT>): GelInsertBase<TTable, TQueryResult>;
  values(values: GelInsertValue<TTable, OverrideT>[]): GelInsertBase<TTable, TQueryResult>;
  select(selectQuery: (qb: QueryBuilder) => GelInsertSelectQueryBuilder<TTable>): GelInsertBase<TTable, TQueryResult>;
  select(selectQuery: (qb: QueryBuilder) => SQL): GelInsertBase<TTable, TQueryResult>;
  select(selectQuery: SQL): GelInsertBase<TTable, TQueryResult>;
  select(selectQuery: GelInsertSelectQueryBuilder<TTable>): GelInsertBase<TTable, TQueryResult>;
}
type GelInsertWithout<T extends AnyGelInsert, TDynamic extends boolean, K$1 extends keyof T & string> = TDynamic extends true ? T : Omit<GelInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K$1>, T['_']['excludedMethods'] | K$1>;
type GelInsertReturning<T extends AnyGelInsert, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = GelInsertBase<T['_']['table'], T['_']['queryResult'], SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>;
type GelInsertReturningAll<T extends AnyGelInsert, TDynamic extends boolean> = GelInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>;
interface GelInsertOnConflictDoUpdateConfig<T extends AnyGelInsert> {
  target: IndexColumn | IndexColumn[];
  /** @deprecated use either `targetWhere` or `setWhere` */
  where?: SQL;
  targetWhere?: SQL;
  setWhere?: SQL;
  set: GelUpdateSetSource<T['_']['table']>;
}
type GelInsertPrepare<T extends AnyGelInsert> = GelPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['returning'] extends undefined ? GelQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
type GelInsertDynamic<T extends AnyGelInsert> = GelInsert<T['_']['table'], T['_']['queryResult'], T['_']['returning']>;
type AnyGelInsert = GelInsertBase<any, any, any, any, any>;
type GelInsert<TTable extends GelTable = GelTable, TQueryResult extends GelQueryResultHKT = GelQueryResultHKT, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = GelInsertBase<TTable, TQueryResult, TReturning, true, never>;
interface GelInsertBase<TTable extends GelTable, TQueryResult extends GelQueryResultHKT, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[], 'gel'>, SQLWrapper {
  readonly _: {
    readonly dialect: 'gel';
    readonly table: TTable;
    readonly queryResult: TQueryResult;
    readonly returning: TReturning;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
    readonly result: TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[];
  };
}
declare class GelInsertBase<TTable extends GelTable, TQueryResult extends GelQueryResultHKT, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[]> implements RunnableQuery<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[], 'gel'>, SQLWrapper {
  private session;
  private dialect;
  static readonly [entityKind]: string;
  private config;
  constructor(table: TTable, values: GelInsertConfig['values'], session: GelSession, dialect: GelDialect, withList?: Subquery[], select?: boolean, overridingSystemValue_?: boolean);
  /**
   * Adds a `returning` clause to the query.
   *
   * Calling this method will return the specified fields of the inserted rows. If no fields are specified, all fields will be returned.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#insert-returning}
   *
   * @example
   * ```ts
   * // Insert one row and return all fields
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   *
   * // Insert one row and return only the id
   * const insertedCarId: { id: number }[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning({ id: cars.id });
   * ```
   */
  returning(): GelInsertWithout<GelInsertReturningAll<this, TDynamic>, TDynamic, 'returning'>;
  returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): GelInsertWithout<GelInsertReturning<this, TDynamic, TSelectedFields>, TDynamic, 'returning'>;
  toSQL(): Query;
  prepare(name: string): GelInsertPrepare<this>;
  execute: ReturnType<this['prepare']>['execute'];
  $dynamic(): GelInsertDynamic<this>;
}
//#endregion
export { AnyGelInsert, GelInsert, GelInsertBase, GelInsertBuilder, GelInsertConfig, GelInsertDynamic, GelInsertOnConflictDoUpdateConfig, GelInsertPrepare, GelInsertReturning, GelInsertReturningAll, GelInsertSelectQueryBuilder, GelInsertValue, GelInsertWithout };
//# sourceMappingURL=insert.d.cts.map