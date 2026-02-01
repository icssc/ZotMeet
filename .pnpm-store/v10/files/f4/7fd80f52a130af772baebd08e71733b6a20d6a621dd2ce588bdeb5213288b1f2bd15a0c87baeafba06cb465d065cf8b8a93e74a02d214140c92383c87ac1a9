import { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { SelectResultFields } from "../../query-builders/select.types.cjs";
import { Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { MsSqlTable } from "../table.cjs";
import { MsSqlDialect } from "../dialect.cjs";
import { AnyQueryResultHKT, MsSqlSession, PreparedQueryConfig, PreparedQueryHKTBase, PreparedQueryKind, QueryResultHKT, QueryResultKind } from "../session.cjs";

//#region src/mssql-core/query-builders/delete.d.ts
type MsSqlDeleteWithout<T extends AnyMsSqlDeleteBase, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<MsSqlDeleteBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['output'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
type MsSqlDeleteReturningAll<T extends AnyMsSqlDeleteBase, TDynamic extends boolean> = MsSqlDeleteWithout<MsSqlDeleteBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'output'>;
type MsSqlDeleteReturning<T extends AnyMsSqlDeleteBase, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = MsSqlDeleteWithout<MsSqlDeleteBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>, TDynamic, 'output'>;
type MsSqlDelete<TTable extends MsSqlTable = MsSqlTable, TQueryResult extends QueryResultHKT = AnyQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TOutput extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = MsSqlDeleteBase<TTable, TQueryResult, TPreparedQueryHKT, TOutput, true, never>;
interface MsSqlDeleteConfig {
  where?: SQL | undefined;
  table: MsSqlTable;
  output?: SelectedFieldsOrdered;
}
type MsSqlDeletePrepare<T extends AnyMsSqlDeleteBase> = PreparedQueryKind<T['_']['preparedQueryHKT'], PreparedQueryConfig & {
  execute: T['_']['output'] extends undefined ? QueryResultKind<T['_']['queryResult'], any> : T['_']['output'][];
  iterator: never;
}>;
type MsSqlDeleteDynamic<T extends AnyMsSqlDeleteBase> = MsSqlDelete<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['output']>;
type AnyMsSqlDeleteBase = MsSqlDeleteBase<any, any, any, any, any, any>;
interface MsSqlDeleteBase<TTable extends MsSqlTable, TQueryResult extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TOutput extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TOutput extends undefined ? QueryResultKind<TQueryResult, any> : TOutput[]> {
  readonly _: {
    readonly table: TTable;
    readonly queryResult: TQueryResult;
    readonly preparedQueryHKT: TPreparedQueryHKT;
    readonly dynamic: TDynamic;
    readonly output: TOutput;
    readonly excludedMethods: TExcludedMethods;
  };
}
declare class MsSqlDeleteBase<TTable extends MsSqlTable, TQueryResult extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TOutput extends Record<string, unknown> | undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TOutput extends undefined ? QueryResultKind<TQueryResult, any> : TOutput[]> implements SQLWrapper {
  private table;
  private session;
  private dialect;
  static readonly [entityKind]: string;
  private config;
  constructor(table: TTable, session: MsSqlSession, dialect: MsSqlDialect);
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
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where: SQL | undefined): MsSqlDeleteWithout<this, TDynamic, 'where'>;
  /**
   * Adds an `output` clause to the query.
   *
   * Calling this method will return the specified fields of the deleted rows. If no fields are specified, all fields will be returned.
   *
   * @example
   * ```ts
   * // Delete all cars with the green color and return all fields
   * const deletedCars: Car[] = await db.delete(cars)
   *   .output();
   *   .where(eq(cars.color, 'green'))
   *
   * // Delete all cars with the green color and return only their id and brand fields
   * const deletedCarsIdsAndBrands: { id: number, brand: string }[] = await db.delete(cars)
   *   .output({ id: cars.id, brand: cars.brand });
   *   .where(eq(cars.color, 'green'))
   * ```
   */
  output(): MsSqlDeleteReturningAll<this, TDynamic>;
  output<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): MsSqlDeleteReturning<this, TDynamic, TSelectedFields>;
  toSQL(): Query;
  prepare(): MsSqlDeletePrepare<this>;
  execute(placeholderValues?: Record<string, unknown>): Promise<TOutput extends undefined ? QueryResultKind<TQueryResult, any> : TOutput[]>;
  private createIterator;
  iterator: ReturnType<this["prepare"]>["iterator"];
  $dynamic(): MsSqlDeleteDynamic<this>;
}
//#endregion
export { MsSqlDelete, MsSqlDeleteBase, MsSqlDeleteConfig, MsSqlDeletePrepare, MsSqlDeleteReturning, MsSqlDeleteReturningAll, MsSqlDeleteWithout };
//# sourceMappingURL=delete.d.cts.map