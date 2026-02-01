import { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { CockroachTable } from "../table.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { SelectResultFields } from "../../query-builders/select.types.cjs";
import { ColumnsSelection, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { CockroachDialect } from "../dialect.cjs";
import { CockroachPreparedQuery, CockroachQueryResultHKT, CockroachQueryResultKind, CockroachSession, PreparedQueryConfig } from "../session.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";

//#region src/cockroach-core/query-builders/delete.d.ts
type CockroachDeleteWithout<T extends AnyCockroachDeleteBase, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<CockroachDeleteBase<T['_']['table'], T['_']['queryResult'], T['_']['selectedFields'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
type CockroachDelete<TTable extends CockroachTable = CockroachTable, TQueryResult extends CockroachQueryResultHKT = CockroachQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = CockroachDeleteBase<TTable, TQueryResult, TSelectedFields, TReturning, true, never>;
interface CockroachDeleteConfig {
  where?: SQL | undefined;
  table: CockroachTable;
  returningFields?: SelectedFieldsFlat;
  returning?: SelectedFieldsOrdered;
  withList?: Subquery[];
}
type CockroachDeleteReturningAll<T extends AnyCockroachDeleteBase, TDynamic extends boolean> = CockroachDeleteWithout<CockroachDeleteBase<T['_']['table'], T['_']['queryResult'], T['_']['table']['_']['columns'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
type CockroachDeleteReturning<T extends AnyCockroachDeleteBase, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = CockroachDeleteWithout<CockroachDeleteBase<T['_']['table'], T['_']['queryResult'], TSelectedFields, SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
type CockroachDeletePrepare<T extends AnyCockroachDeleteBase> = CockroachPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['returning'] extends undefined ? CockroachQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
type CockroachDeleteDynamic<T extends AnyCockroachDeleteBase> = CockroachDelete<T['_']['table'], T['_']['queryResult'], T['_']['selectedFields'], T['_']['returning']>;
type AnyCockroachDeleteBase = CockroachDeleteBase<any, any, any, any, any, any>;
interface CockroachDeleteBase<TTable extends CockroachTable, TQueryResult extends CockroachQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[]>, QueryPromise<TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[], 'cockroach'>, SQLWrapper {
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
declare class CockroachDeleteBase<TTable extends CockroachTable, TQueryResult extends CockroachQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[]> implements TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? CockroachQueryResultKind<TQueryResult, never> : TReturning[], 'cockroach'>, SQLWrapper {
  private session;
  private dialect;
  static readonly [entityKind]: string;
  private config;
  constructor(table: TTable, session: CockroachSession, dialect: CockroachDialect, withList?: Subquery[]);
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
  where(where: SQL | undefined): CockroachDeleteWithout<this, TDynamic, 'where'>;
  /**
   * Adds a `returning` clause to the query.
   *
   * Calling this method will return the specified fields of the deleted rows. If no fields are specified, all fields will be returned.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete#delete-with-return}
   *
   * @example
   * ```ts
   * // Delete all cars with the green color and return all fields
   * const deletedCars: Car[] = await db.delete(cars)
   *   .where(eq(cars.color, 'green'))
   *   .returning();
   *
   * // Delete all cars with the green color and return only their id and brand fields
   * const deletedCarsIdsAndBrands: { id: number, brand: string }[] = await db.delete(cars)
   *   .where(eq(cars.color, 'green'))
   *   .returning({ id: cars.id, brand: cars.brand });
   * ```
   */
  returning(): CockroachDeleteReturningAll<this, TDynamic>;
  returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): CockroachDeleteReturning<this, TDynamic, TSelectedFields>;
  toSQL(): Query;
  prepare(name: string): CockroachDeletePrepare<this>;
  private authToken?;
  execute: ReturnType<this['prepare']>['execute'];
  $dynamic(): CockroachDeleteDynamic<this>;
}
//#endregion
export { AnyCockroachDeleteBase, CockroachDelete, CockroachDeleteBase, CockroachDeleteConfig, CockroachDeleteDynamic, CockroachDeletePrepare, CockroachDeleteReturning, CockroachDeleteReturningAll, CockroachDeleteWithout };
//# sourceMappingURL=delete.d.cts.map