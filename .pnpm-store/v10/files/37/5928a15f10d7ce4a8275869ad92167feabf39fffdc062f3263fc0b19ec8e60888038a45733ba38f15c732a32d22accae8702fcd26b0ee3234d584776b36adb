import { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { SelectResultFields } from "../../query-builders/select.types.cjs";
import { Param, Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { InferInsertModel, InferSelectModel } from "../../table.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { MsSqlTable } from "../table.cjs";
import { MsSqlDialect } from "../dialect.cjs";
import { AnyQueryResultHKT, MsSqlSession, PreparedQueryConfig, PreparedQueryHKTBase, PreparedQueryKind, QueryResultHKT, QueryResultKind } from "../session.cjs";

//#region src/mssql-core/query-builders/insert.d.ts
interface MsSqlInsertConfig<TTable extends MsSqlTable = MsSqlTable> {
  table: TTable;
  values: Record<string, Param | SQL>[];
  output?: SelectedFieldsOrdered;
}
type MsSqlInsertValue<TTable extends MsSqlTable, TModel extends Record<string, any> = InferInsertModel<TTable>> = { [Key in keyof TModel]: TModel[Key] | SQL | Placeholder } & {};
declare class MsSqlInsertBuilder<TTable extends MsSqlTable, TQueryResult extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TOutput extends Record<string, unknown> | undefined = undefined> {
  static readonly [entityKind]: string;
  private config;
  protected table: TTable;
  protected session: MsSqlSession;
  protected dialect: MsSqlDialect;
  constructor(table: TTable, session: MsSqlSession, dialect: MsSqlDialect, output?: SelectedFieldsOrdered);
  values(value: MsSqlInsertValue<TTable>): MsSqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT, TOutput>;
  values(values: MsSqlInsertValue<TTable>[]): MsSqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT, TOutput>;
  /**
   * Adds an `output` clause to the query.
   *
   * Calling this method will return the specified fields of the inserted rows. If no fields are specified, all fields will be returned.
   *
   * @example
   * ```ts
   * // Insert one row and return all fields
   * const insertedCar: Car[] = await db.insert(cars)
   *   .output();
   *   .values({ brand: 'BMW' })
   *
   * // Insert one row and return only the id
   * const insertedCarId: { id: number }[] = await db.insert(cars)
   *   .output({ id: cars.id });
   *   .values({ brand: 'BMW' })
   * ```
   */
  output(): Omit<MsSqlInsertBuilder<TTable, TQueryResult, TPreparedQueryHKT, InferSelectModel<TTable>>, 'output'>;
  output<SelectedFields extends SelectedFieldsFlat>(fields: SelectedFields): Omit<MsSqlInsertBuilder<TTable, TQueryResult, TPreparedQueryHKT, SelectResultFields<SelectedFields>>, 'output'>;
}
type MsSqlInsertWithout<T extends AnyMsSqlInsert, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<MsSqlInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['output'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
type MsSqlInsertDynamic<T extends AnyMsSqlInsert> = MsSqlInsert<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['output']>;
type MsSqlInsertPrepare<T extends AnyMsSqlInsert> = PreparedQueryKind<T['_']['preparedQueryHKT'], PreparedQueryConfig & {
  execute: T['_']['output'] extends undefined ? QueryResultKind<T['_']['queryResult'], any> : T['_']['output'][];
  iterator: never;
}>;
type MsSqlInsert<TTable extends MsSqlTable = MsSqlTable, TQueryResult extends QueryResultHKT = AnyQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TOutput extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = MsSqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT, TOutput, true, never>;
type AnyMsSqlInsert = MsSqlInsertBase<any, any, any, any, any, any>;
interface MsSqlInsertBase<TTable extends MsSqlTable, TQueryResult extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TOutput extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TOutput extends undefined ? QueryResultKind<TQueryResult, any> : TOutput[]>, SQLWrapper {
  readonly _: {
    readonly table: TTable;
    readonly queryResult: TQueryResult;
    readonly preparedQueryHKT: TPreparedQueryHKT;
    readonly output: TOutput;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
  };
}
declare class MsSqlInsertBase<TTable extends MsSqlTable, TQueryResult extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TOutput extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TOutput extends undefined ? QueryResultKind<TQueryResult, any> : TOutput[]> implements SQLWrapper {
  private session;
  private dialect;
  static readonly [entityKind]: string;
  protected $table: TTable;
  private config;
  constructor(table: TTable, values: MsSqlInsertConfig['values'], session: MsSqlSession, dialect: MsSqlDialect, output?: SelectedFieldsOrdered);
  toSQL(): Query;
  prepare(): MsSqlInsertPrepare<this>;
  execute(placeholderValues?: Record<string, unknown>): Promise<TOutput extends undefined ? QueryResultKind<TQueryResult, any> : TOutput[]>;
  private createIterator;
  iterator: ReturnType<this["prepare"]>["iterator"];
}
//#endregion
export { AnyMsSqlInsert, MsSqlInsert, MsSqlInsertBase, MsSqlInsertBuilder, MsSqlInsertConfig, MsSqlInsertDynamic, MsSqlInsertPrepare, MsSqlInsertValue, MsSqlInsertWithout };
//# sourceMappingURL=insert.d.cts.map