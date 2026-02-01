import { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
import { AnyPgColumn } from "../columns/common.cjs";
import { QueryBuilder } from "./query-builder.cjs";
import { PgUpdateSetSource } from "./update.cjs";
import { entityKind } from "../../entity.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { SelectResultFields } from "../../query-builders/select.types.cjs";
import { ColumnsSelection, Param, Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { InferInsertModel } from "../../table.cjs";
import { Assume } from "../../utils.cjs";
import { WithCacheConfig } from "../../cache/core/types.cjs";
import { PgTable, TableConfig as TableConfig$1 } from "../table.cjs";
import { PgDialect } from "../dialect.cjs";
import { PgQueryResultHKT, PgQueryResultKind, PgSession } from "../session.cjs";
import { IndexColumn } from "../indexes.cjs";

//#region src/pg-core/query-builders/insert.d.ts
interface PgInsertConfig<TTable extends PgTable = PgTable> {
  table: TTable;
  values: Record<string, Param | SQL>[] | PgInsertSelectQueryBuilder<TTable> | SQL;
  withList?: Subquery[];
  onConflict?: SQL;
  returningFields?: SelectedFieldsFlat;
  returning?: SelectedFieldsOrdered;
  select?: boolean;
  overridingSystemValue_?: boolean;
}
type PgInsertValue<TTable extends PgTable<TableConfig$1>, OverrideT extends boolean = false, TModel extends Record<string, any> = InferInsertModel<TTable, {
  dbColumnNames: false;
  override: OverrideT;
}>> = { [Key in keyof TModel]: TModel[Key] | SQL | Placeholder } & {};
type PgInsertSelectQueryBuilder<TTable extends PgTable, TModel extends Record<string, any> = InferInsertModel<TTable>> = TypedQueryBuilder<{ [K in keyof TModel]: AnyPgColumn | SQL | SQL.Aliased | TModel[K] }>;
interface PgInsertBuilderConstructor {
  new (table: PgTable, values: PgInsertConfig['values'], session: PgSession, dialect: PgDialect, withList?: Subquery[], select?: boolean, overridingSystemValue_?: boolean): AnyPgInsert;
}
declare class PgInsertBuilder<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, OverrideT extends boolean = false, TBuilderHKT extends PgInsertHKTBase = PgInsertHKT> {
  private table;
  private session;
  private dialect;
  private withList?;
  private overridingSystemValue_?;
  private builder;
  static readonly [entityKind]: string;
  constructor(table: TTable, session: PgSession, dialect: PgDialect, withList?: Subquery[] | undefined, overridingSystemValue_?: boolean | undefined, builder?: PgInsertBuilderConstructor);
  overridingSystemValue(): Omit<PgInsertBuilder<TTable, TQueryResult, true, TBuilderHKT>, 'overridingSystemValue'>;
  values(value: PgInsertValue<TTable, OverrideT>): PgInsertKind<TBuilderHKT, TTable, TQueryResult>;
  values(values: PgInsertValue<TTable, OverrideT>[]): PgInsertKind<TBuilderHKT, TTable, TQueryResult>;
  select(selectQuery: (qb: QueryBuilder) => PgInsertSelectQueryBuilder<TTable>): PgInsertKind<TBuilderHKT, TTable, TQueryResult>;
  select(selectQuery: (qb: QueryBuilder) => SQL): PgInsertKind<TBuilderHKT, TTable, TQueryResult>;
  select(selectQuery: SQL): PgInsertBase<TBuilderHKT, TTable, TQueryResult>;
  select(selectQuery: PgInsertSelectQueryBuilder<TTable>): PgInsertKind<TBuilderHKT, TTable, TQueryResult>;
}
interface PgInsertHKTBase {
  table: unknown;
  queryResult: unknown;
  selectedFields: unknown;
  returning: unknown;
  dynamic: boolean;
  excludedMethods: string;
  result: unknown;
  _type: unknown;
}
interface PgInsertHKT extends PgInsertHKTBase {
  _type: PgInsertBase<PgInsertHKT, Assume<this['table'], PgTable>, Assume<this['queryResult'], PgQueryResultHKT>, this['selectedFields'], this['returning'], this['dynamic'], this['excludedMethods']>;
}
type PgInsertKind<T extends PgInsertHKTBase, TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> = (T & {
  table: TTable;
  queryResult: TQueryResult;
  selectedFields: TSelectedFields;
  returning: TReturning;
  dynamic: TDynamic;
  excludedMethods: TExcludedMethods;
})['_type'];
type PgInsertWithout<T extends AnyPgInsert, TDynamic extends boolean, K$1 extends string> = TDynamic extends true ? T : Omit<PgInsertKind<T['_']['hkt'], T['_']['table'], T['_']['queryResult'], T['_']['selectedFields'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K$1>, T['_']['excludedMethods'] | K$1>;
type PgInsertReturning<T extends AnyPgInsert, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = T extends any ? PgInsertWithout<PgInsertKind<T['_']['hkt'], T['_']['table'], T['_']['queryResult'], TSelectedFields, SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'> : never;
type PgInsertReturningAll<T extends AnyPgInsert, TDynamic extends boolean> = T extends any ? PgInsertWithout<PgInsertKind<T['_']['hkt'], T['_']['table'], T['_']['queryResult'], T['_']['table']['_']['columns'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'> : never;
interface PgInsertOnConflictDoUpdateConfig<T extends AnyPgInsert> {
  target: IndexColumn | IndexColumn[];
  /** @deprecated use either `targetWhere` or `setWhere` */
  where?: SQL;
  targetWhere?: SQL;
  setWhere?: SQL;
  set: PgUpdateSetSource<T['_']['table']>;
}
type PgInsertDynamic<T extends AnyPgInsert> = PgInsertKind<T['_']['hkt'], T['_']['table'], T['_']['queryResult'], T['_']['selectedFields'], T['_']['returning'], true, never>;
type AnyPgInsert = PgInsertBase<any, any, any, any, any, any, any>;
type PgInsert<TTable extends PgTable = PgTable, TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = ColumnsSelection | undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = PgInsertBase<PgInsertHKT, TTable, TQueryResult, TSelectedFields, TReturning, true, never>;
interface PgInsertBase<THKT extends PgInsertHKTBase, TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields = undefined, TReturning = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, SQLWrapper {
  readonly _: {
    readonly dialect: 'pg';
    readonly hkt: THKT;
    readonly table: TTable;
    readonly queryResult: TQueryResult;
    readonly selectedFields: TSelectedFields;
    readonly returning: TReturning;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
    readonly result: TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[];
  };
}
declare class PgInsertBase<THKT extends PgInsertHKTBase, TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields = undefined, TReturning = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> implements TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, SQLWrapper {
  protected session: PgSession;
  protected dialect: PgDialect;
  static readonly [entityKind]: string;
  protected config: PgInsertConfig<TTable>;
  protected cacheConfig?: WithCacheConfig;
  constructor(table: TTable, values: PgInsertConfig['values'], session: PgSession, dialect: PgDialect, withList?: Subquery[], select?: boolean, overridingSystemValue_?: boolean);
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
  returning(): PgInsertReturningAll<this, TDynamic>;
  returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): PgInsertReturning<this, TDynamic, TSelectedFields>;
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
  }): PgInsertWithout<this, TDynamic, 'onConflictDoNothing' | 'onConflictDoUpdate'>;
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
  onConflictDoUpdate(config: PgInsertOnConflictDoUpdateConfig<this>): PgInsertWithout<this, TDynamic, 'onConflictDoNothing' | 'onConflictDoUpdate'>;
  toSQL(): Query;
  $dynamic(): PgInsertDynamic<this>;
}
//#endregion
export { AnyPgInsert, PgInsert, PgInsertBase, PgInsertBuilder, PgInsertBuilderConstructor, PgInsertConfig, PgInsertDynamic, PgInsertHKT, PgInsertHKTBase, PgInsertKind, PgInsertOnConflictDoUpdateConfig, PgInsertReturning, PgInsertReturningAll, PgInsertSelectQueryBuilder, PgInsertValue, PgInsertWithout };
//# sourceMappingURL=insert.d.cts.map