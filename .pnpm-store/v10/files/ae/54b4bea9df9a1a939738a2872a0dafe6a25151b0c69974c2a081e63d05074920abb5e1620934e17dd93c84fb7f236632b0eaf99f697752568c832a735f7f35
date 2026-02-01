import { AnyCockroachColumn } from "../columns/common.cjs";
import { QueryBuilder } from "./query-builder.cjs";
import { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
import { CockroachUpdateSetSource } from "./update.cjs";
import { entityKind } from "../../entity.cjs";
import { CockroachTable, TableConfig } from "../table.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { SelectResultFields } from "../../query-builders/select.types.cjs";
import { ColumnsSelection, Param, Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { InferInsertModel } from "../../table.cjs";
import { CockroachDialect } from "../dialect.cjs";
import { CockroachPreparedQuery, CockroachQueryResultHKT, CockroachQueryResultKind, CockroachSession, PreparedQueryConfig } from "../session.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";
import { IndexColumn } from "../indexes.cjs";

//#region src/cockroach-core/query-builders/insert.d.ts
interface CockroachInsertConfig<TTable extends CockroachTable = CockroachTable> {
  table: TTable;
  values: Record<string, Param | SQL>[] | CockroachInsertSelectQueryBuilder<TTable> | SQL;
  withList?: Subquery[];
  onConflict?: SQL;
  returningFields?: SelectedFieldsFlat;
  returning?: SelectedFieldsOrdered;
  select?: boolean;
}
type CockroachInsertValue<TTable extends CockroachTable<TableConfig>, OverrideT extends boolean = false, TModel extends Record<string, any> = InferInsertModel<TTable, {
  dbColumnNames: false;
  override: OverrideT;
}>> = { [Key in keyof TModel]: TModel[Key] | SQL | Placeholder } & {};
type CockroachInsertSelectQueryBuilder<TTable extends CockroachTable, TModel extends Record<string, any> = InferInsertModel<TTable>> = TypedQueryBuilder<{ [K in keyof TModel]: AnyCockroachColumn | SQL | SQL.Aliased | TModel[K] }>;
declare class CockroachInsertBuilder<TTable extends CockroachTable, TQueryResult extends CockroachQueryResultHKT, OverrideT extends boolean = false> {
  private table;
  private session;
  private dialect;
  private withList?;
  static readonly [entityKind]: string;
  constructor(table: TTable, session: CockroachSession, dialect: CockroachDialect, withList?: Subquery[] | undefined);
  values(value: CockroachInsertValue<TTable, OverrideT>): CockroachInsertBase<TTable, TQueryResult>;
  values(values: CockroachInsertValue<TTable, OverrideT>[]): CockroachInsertBase<TTable, TQueryResult>;
  select(selectQuery: (qb: QueryBuilder) => CockroachInsertSelectQueryBuilder<TTable>): CockroachInsertBase<TTable, TQueryResult>;
  select(selectQuery: (qb: QueryBuilder) => SQL): CockroachInsertBase<TTable, TQueryResult>;
  select(selectQuery: SQL): CockroachInsertBase<TTable, TQueryResult>;
  select(selectQuery: CockroachInsertSelectQueryBuilder<TTable>): CockroachInsertBase<TTable, TQueryResult>;
}
type CockroachInsertWithout<T extends AnyCockroachInsert, TDynamic extends boolean, K$1 extends keyof T & string> = TDynamic extends true ? T : Omit<CockroachInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['selectedFields'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K$1>, T['_']['excludedMethods'] | K$1>;
type CockroachInsertReturning<T extends AnyCockroachInsert, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = CockroachInsertBase<T['_']['table'], T['_']['queryResult'], TSelectedFields, SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>;
type CockroachInsertReturningAll<T extends AnyCockroachInsert, TDynamic extends boolean> = CockroachInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['table']['_']['columns'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>;
interface CockroachInsertOnConflictDoUpdateConfig<T extends AnyCockroachInsert> {
  target: IndexColumn | IndexColumn[];
  /** @deprecated use either `targetWhere` or `setWhere` */
  where?: SQL;
  targetWhere?: SQL;
  setWhere?: SQL;
  set: CockroachUpdateSetSource<T['_']['table']>;
}
type CockroachInsertPrepare<T extends AnyCockroachInsert> = CockroachPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['returning'] extends undefined ? CockroachQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
type CockroachInsertDynamic<T extends AnyCockroachInsert> = CockroachInsert<T['_']['table'], T['_']['queryResult'], T['_']['returning']>;
type AnyCockroachInsert = CockroachInsertBase<any, any, any, any, any, any>;
type CockroachInsert<TTable extends CockroachTable = CockroachTable, TQueryResult extends CockroachQueryResultHKT = CockroachQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = ColumnsSelection | undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = CockroachInsertBase<TTable, TQueryResult, TSelectedFields, TReturning, true, never>;
interface CockroachInsertBase<TTable extends CockroachTable, TQueryResult extends CockroachQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[]>, QueryPromise<TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[], 'cockroach'>, SQLWrapper {
  readonly _: {
    readonly dialect: 'cockroach';
    readonly table: TTable;
    readonly queryResult: TQueryResult;
    readonly selectedFields: TSelectedFields;
    readonly returning: TReturning;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
    readonly result: TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[];
  };
}
declare class CockroachInsertBase<TTable extends CockroachTable, TQueryResult extends CockroachQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[]> implements TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[], 'cockroach'>, SQLWrapper {
  private session;
  private dialect;
  static readonly [entityKind]: string;
  private config;
  constructor(table: TTable, values: CockroachInsertConfig['values'], session: CockroachSession, dialect: CockroachDialect, withList?: Subquery[], select?: boolean);
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
  returning(): CockroachInsertWithout<CockroachInsertReturningAll<this, TDynamic>, TDynamic, 'returning'>;
  returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): CockroachInsertWithout<CockroachInsertReturning<this, TDynamic, TSelectedFields>, TDynamic, 'returning'>;
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
  onConflictDoNothing(config?: {
    target?: IndexColumn | IndexColumn[];
    where?: SQL;
  }): CockroachInsertWithout<this, TDynamic, 'onConflictDoNothing' | 'onConflictDoUpdate'>;
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
  onConflictDoUpdate(config: CockroachInsertOnConflictDoUpdateConfig<this>): CockroachInsertWithout<this, TDynamic, 'onConflictDoNothing' | 'onConflictDoUpdate'>;
  toSQL(): Query;
  prepare(name: string): CockroachInsertPrepare<this>;
  private authToken?;
  execute: ReturnType<this['prepare']>['execute'];
  $dynamic(): CockroachInsertDynamic<this>;
}
//#endregion
export { AnyCockroachInsert, CockroachInsert, CockroachInsertBase, CockroachInsertBuilder, CockroachInsertConfig, CockroachInsertDynamic, CockroachInsertOnConflictDoUpdateConfig, CockroachInsertPrepare, CockroachInsertReturning, CockroachInsertReturningAll, CockroachInsertSelectQueryBuilder, CockroachInsertValue, CockroachInsertWithout };
//# sourceMappingURL=insert.d.cts.map