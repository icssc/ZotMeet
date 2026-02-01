import { SelectedFieldsFlatUpdate, SelectedFieldsOrdered } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { SelectResultFields } from "../../query-builders/select.types.cjs";
import { Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { InferInsertModel } from "../../table.cjs";
import { UpdateSet } from "../../utils.cjs";
import { GetColumnData } from "../../column.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { ExtractObjectValues } from "../../relations.cjs";
import { MsSqlTable } from "../table.cjs";
import { MsSqlDialect } from "../dialect.cjs";
import { AnyQueryResultHKT, MsSqlSession, PreparedQueryConfig, PreparedQueryHKTBase, PreparedQueryKind, QueryResultHKT, QueryResultKind } from "../session.cjs";

//#region src/mssql-core/query-builders/update.d.ts
interface MsSqlUpdateConfig {
  where?: SQL | undefined;
  set: UpdateSet;
  table: MsSqlTable;
  output?: {
    inserted?: SelectedFieldsOrdered;
    deleted?: SelectedFieldsOrdered;
  };
}
type MsSqlUpdateSetSource<TTable extends MsSqlTable> = { [Key in keyof InferInsertModel<TTable>]?: GetColumnData<TTable['_']['columns'][Key], 'query'> | Placeholder | SQL } & {};
type NonUndefinedKeysOnly<T> = ExtractObjectValues<{ [K in keyof T as T[K] extends undefined ? never : K]: K }> & keyof T;
type FormSelection<T, TTable extends MsSqlTable> = { [K in keyof T as T[K] extends undefined ? never : K]: T[K] extends true ? TTable['_']['columns'] : T[K] };
type MsSqlUpdateReturning<T extends AnyMsSqlUpdateBase, TDynamic extends boolean, SelectedFields extends SelectedFieldsFlatUpdate> = MsSqlUpdateWithout<MsSqlUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], SelectResultFields<FormSelection<SelectedFields, T['_']['table']>>, TDynamic, T['_']['excludedMethods']>, TDynamic, 'output'>;
type MsSqlUpdateReturningAll<T extends AnyMsSqlUpdateBase, TDynamic extends boolean> = MsSqlUpdateWithout<MsSqlUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'output'>;
declare class MsSqlUpdateBuilder<TTable extends MsSqlTable, TQueryResult extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase> {
  private table;
  private session;
  private dialect;
  static readonly [entityKind]: string;
  readonly _: {
    readonly table: TTable;
  };
  constructor(table: TTable, session: MsSqlSession, dialect: MsSqlDialect);
  set(values: MsSqlUpdateSetSource<TTable>): MsSqlUpdateBase<TTable, TQueryResult, TPreparedQueryHKT>;
}
type MsSqlUpdateWithout<T extends AnyMsSqlUpdateBase, TDynamic extends boolean, K$1 extends keyof T & string> = TDynamic extends true ? T : Omit<MsSqlUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['output'], TDynamic, T['_']['excludedMethods'] | K$1>, T['_']['excludedMethods'] | K$1>;
type MsSqlUpdatePrepare<T extends AnyMsSqlUpdateBase> = PreparedQueryKind<T['_']['preparedQueryHKT'], PreparedQueryConfig & {
  execute: T['_']['output'] extends undefined ? QueryResultKind<T['_']['queryResult'], any> : T['_']['output'][];
  iterator: never;
}>;
type MsSqlUpdateDynamic<T extends AnyMsSqlUpdateBase> = MsSqlUpdate<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['output']>;
type MsSqlUpdate<TTable extends MsSqlTable = MsSqlTable, TQueryResult extends QueryResultHKT = AnyQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TOutput extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = MsSqlUpdateBase<TTable, TQueryResult, TPreparedQueryHKT, TOutput, true, never>;
type AnyMsSqlUpdateBase = MsSqlUpdateBase<any, any, any, any, any, any>;
interface MsSqlUpdateBase<TTable extends MsSqlTable, TQueryResult extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TOutput extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TOutput extends undefined ? QueryResultKind<TQueryResult, any> : TOutput[]>, SQLWrapper {
  readonly _: {
    readonly table: TTable;
    readonly queryResult: TQueryResult;
    readonly preparedQueryHKT: TPreparedQueryHKT;
    readonly output: TOutput;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
  };
}
declare class MsSqlUpdateBase<TTable extends MsSqlTable, TQueryResult extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TOutput extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TOutput extends undefined ? QueryResultKind<TQueryResult, any> : TOutput[]> implements SQLWrapper {
  private session;
  private dialect;
  static readonly [entityKind]: string;
  private config;
  constructor(table: TTable, set: UpdateSet, session: MsSqlSession, dialect: MsSqlDialect);
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
  where(where: SQL | undefined): MsSqlUpdateWithout<this, TDynamic, 'where'>;
  /**
   * Adds an `output` clause to the query.
   *
   * This method allows you to return values from the rows affected by the query.
   * MSSQL supports returning `inserted` (new row values) and `deleted` (old row values) values.
   *
   * If no fields are specified, all `inserted` values will be returned by default.
   *
   * @example
   * ```ts
   * // Update cars and return all new values
   * const updatedCars: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .output()
   *   .where(eq(cars.color, 'green'));
   *
   * // Update cars and return all old values
   * const updatedCarsIds: { deleted: Car }[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .output({ deleted: true })
   *   .where(eq(cars.color, 'green'));
   *
   * // Update cars and return partial old and new values
   * const beforeAndAfter: { deleted: { oldColor: string }, inserted: { newColor: string } }[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .output({
   *     deleted: { oldColor: cars.color },
   *     inserted: { newColor: cars.color }
   *   })
   *   .where(eq(cars.color, 'green'));
   * ```
   */
  output(): MsSqlUpdateReturningAll<this, TDynamic>;
  output<TSelectedFields extends SelectedFieldsFlatUpdate>(fields: TSelectedFields): MsSqlUpdateReturning<this, TDynamic, TSelectedFields>;
  toSQL(): Query;
  prepare(): MsSqlUpdatePrepare<this>;
  execute(placeholderValues?: Record<string, unknown>): Promise<TOutput extends undefined ? QueryResultKind<TQueryResult, any> : TOutput[]>;
  private createIterator;
  iterator: ReturnType<this["prepare"]>["iterator"];
  $dynamic(): MsSqlUpdateDynamic<this>;
}
//#endregion
export { AnyMsSqlUpdateBase, FormSelection, MsSqlUpdate, MsSqlUpdateBase, MsSqlUpdateBuilder, MsSqlUpdateConfig, MsSqlUpdateDynamic, MsSqlUpdatePrepare, MsSqlUpdateReturning, MsSqlUpdateReturningAll, MsSqlUpdateSetSource, MsSqlUpdateWithout, NonUndefinedKeysOnly };
//# sourceMappingURL=update.d.cts.map