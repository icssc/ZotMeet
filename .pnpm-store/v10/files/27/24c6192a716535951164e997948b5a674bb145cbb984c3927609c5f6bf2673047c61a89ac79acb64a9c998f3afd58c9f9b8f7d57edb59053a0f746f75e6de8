import { PgSelectJoinConfig, SelectedFields, SelectedFieldsOrdered, TableLikeHasEmptySelection } from "./select.types.cjs";
import { PgColumn } from "../columns/common.cjs";
import { PgViewBase } from "../view-base.cjs";
import { entityKind } from "../../entity.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { AppendToNullabilityMap, AppendToResult, GetSelectTableName, GetSelectTableSelection, JoinNullability, JoinType, SelectMode, SelectResult } from "../../query-builders/select.types.cjs";
import { ColumnsSelection, Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { InferInsertModel, Table } from "../../table.cjs";
import { Assume, DrizzleTypeError, Equal, Simplify, UpdateSet } from "../../utils.cjs";
import { GetColumnData } from "../../column.cjs";
import { WithCacheConfig } from "../../cache/core/types.cjs";
import { PgTable } from "../table.cjs";
import { PgDialect } from "../dialect.cjs";
import { PgQueryResultHKT, PgQueryResultKind, PgSession } from "../session.cjs";

//#region src/pg-core/query-builders/update.d.ts
interface PgUpdateConfig {
  where?: SQL | undefined;
  set: UpdateSet;
  table: PgTable;
  from?: PgTable | Subquery | PgViewBase | SQL;
  joins: PgSelectJoinConfig[];
  returningFields?: SelectedFields;
  returning?: SelectedFieldsOrdered;
  withList?: Subquery[];
}
type PgUpdateSetSource<TTable extends PgTable, TModel extends Record<string, any> = InferInsertModel<TTable>> = { [Key in keyof TModel & string]?: GetColumnData<TTable['_']['columns'][Key]> | SQL | PgColumn | Placeholder | undefined } & {};
interface PgUpdateBuilderConstructor {
  new (table: PgTable, set: UpdateSet, session: PgSession, dialect: PgDialect, withList?: Subquery[]): AnyPgUpdate;
}
declare class PgUpdateBuilder<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TBuilderHKT extends PgUpdateHKTBase = PgUpdateHKT> {
  private table;
  private session;
  private dialect;
  private withList?;
  private builder;
  static readonly [entityKind]: string;
  readonly _: {
    readonly table: TTable;
  };
  constructor(table: TTable, session: PgSession, dialect: PgDialect, withList?: Subquery[] | undefined, builder?: PgUpdateBuilderConstructor);
  set(values: PgUpdateSetSource<TTable>): PgUpdateWithout<Assume<PgUpdateKind<TBuilderHKT, TTable, TQueryResult>, AnyPgUpdate>, false, 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>;
}
type PgUpdateWithout<T extends AnyPgUpdate, TDynamic extends boolean, K$1 extends keyof T & string> = TDynamic extends true ? T : Omit<PgUpdateKind<T['_']['hkt'], T['_']['table'], T['_']['queryResult'], T['_']['from'], T['_']['selectedFields'], T['_']['returning'], T['_']['nullabilityMap'], T['_']['joins'], TDynamic, T['_']['excludedMethods'] | K$1>, T['_']['excludedMethods'] | K$1>;
type PgUpdateWithJoins<T extends AnyPgUpdate, TDynamic extends boolean, TFrom extends PgTable | Subquery | PgViewBase | SQL> = Omit<PgUpdateKind<T['_']['hkt'], T['_']['table'], T['_']['queryResult'], TFrom, T['_']['selectedFields'], T['_']['returning'], AppendToNullabilityMap<T['_']['nullabilityMap'], GetSelectTableName<TFrom>, 'inner'>, [...T['_']['joins'], {
  name: GetSelectTableName<TFrom>;
  joinType: 'inner';
  table: TFrom;
}], TDynamic, TDynamic extends true ? never : Exclude<T['_']['excludedMethods'] | 'from', 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>>, TDynamic extends true ? never : Exclude<T['_']['excludedMethods'] | 'from', 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>>;
type PgUpdateJoinFn<T extends AnyPgUpdate, TDynamic extends boolean, TJoinType extends JoinType> = <TJoinedTable extends PgTable | Subquery | PgViewBase | SQL>(table: TableLikeHasEmptySelection<TJoinedTable> extends true ? DrizzleTypeError<"Cannot reference a data-modifying statement subquery if it doesn't contain a `returning` clause"> : TJoinedTable, on: ((updateTable: T['_']['table']['_']['columns'], from: T['_']['from'] extends PgTable ? T['_']['from']['_']['columns'] : T['_']['from'] extends Subquery | PgViewBase ? T['_']['from']['_']['selectedFields'] : never) => SQL | undefined) | SQL | undefined) => PgUpdateJoin<T, TDynamic, TJoinType, TJoinedTable>;
type PgUpdateJoin<T extends AnyPgUpdate, TDynamic extends boolean, TJoinType extends JoinType, TJoinedTable extends PgTable | Subquery | PgViewBase | SQL> = Omit<PgUpdateKind<T['_']['hkt'], T['_']['table'], T['_']['queryResult'], T['_']['from'], T['_']['selectedFields'], T['_']['returning'], AppendToNullabilityMap<T['_']['nullabilityMap'], GetSelectTableName<TJoinedTable>, TJoinType>, [...T['_']['joins'], {
  name: GetSelectTableName<TJoinedTable>;
  joinType: TJoinType;
  table: TJoinedTable;
}], TDynamic, TDynamic extends true ? never : T['_']['excludedMethods']>, TDynamic extends true ? never : T['_']['excludedMethods']>;
type Join = {
  name: string | undefined;
  joinType: JoinType;
  table: PgTable | Subquery | PgViewBase | SQL;
};
type AccumulateToResult<T extends AnyPgUpdate, TSelectMode extends SelectMode, TJoins extends Join[], TSelectedFields extends ColumnsSelection> = TJoins extends [infer TJoin extends Join, ...infer TRest extends Join[]] ? AccumulateToResult<T, TSelectMode extends 'partial' ? TSelectMode : 'multiple', TRest, AppendToResult<T['_']['table']['_']['name'], TSelectedFields, TJoin['name'], TJoin['table'] extends Table ? TJoin['table']['_']['columns'] : TJoin['table'] extends Subquery ? Assume<TJoin['table']['_']['selectedFields'], SelectedFields> : never, TSelectMode extends 'partial' ? TSelectMode : 'multiple'>> : TSelectedFields;
type PgUpdateReturningAll<T extends AnyPgUpdate, TDynamic extends boolean> = T extends any ? PgUpdateWithout<PgUpdateKind<T['_']['hkt'], T['_']['table'], T['_']['queryResult'], T['_']['from'], Equal<T['_']['joins'], []> extends true ? T['_']['table']['_']['columns'] : Simplify<Record<T['_']['table']['_']['name'], T['_']['table']['_']['columns']> & { [K in keyof T['_']['joins'] as T['_']['joins'][K]['table']['_']['name']]: T['_']['joins'][K]['table']['_']['columns'] }>, SelectResult<AccumulateToResult<T, 'single', T['_']['joins'], GetSelectTableSelection<T['_']['table']>>, 'partial', T['_']['nullabilityMap']>, T['_']['nullabilityMap'], T['_']['joins'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'> : never;
type PgUpdateReturning<T extends AnyPgUpdate, TDynamic extends boolean, TSelectedFields extends SelectedFields> = T extends any ? PgUpdateWithout<PgUpdateKind<T['_']['hkt'], T['_']['table'], T['_']['queryResult'], T['_']['from'], TSelectedFields, SelectResult<AccumulateToResult<T, 'partial', T['_']['joins'], TSelectedFields>, 'partial', T['_']['nullabilityMap']>, T['_']['nullabilityMap'], T['_']['joins'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'> : never;
type PgUpdateDynamic<T extends AnyPgUpdate> = PgUpdateKind<T['_']['hkt'], T['_']['table'], T['_']['queryResult'], T['_']['from'], T['_']['selectedFields'], T['_']['returning'], T['_']['nullabilityMap'], T['_']['joins'], true, never>;
type PgUpdate<TTable extends PgTable = PgTable, TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TFrom extends PgTable | Subquery | PgViewBase | SQL | undefined = undefined, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = []> = PgUpdateBase<PgUpdateHKT, TTable, TQueryResult, TFrom, TSelectedFields, TReturning, TNullabilityMap, TJoins, true, never>;
interface PgUpdateHKTBase {
  table: unknown;
  joins: unknown;
  nullabilityMap: unknown;
  queryResult: unknown;
  from: unknown;
  selectedFields: unknown;
  returning: unknown;
  dynamic: boolean;
  excludedMethods: string;
  _type: unknown;
}
interface PgUpdateHKT extends PgUpdateHKTBase {
  _type: PgUpdateBase<PgUpdateHKT, Assume<this['table'], PgTable>, Assume<this['queryResult'], PgQueryResultHKT>, Assume<this['from'], PgTable | Subquery | PgViewBase | SQL | undefined>, Assume<this['selectedFields'], ColumnsSelection | undefined>, Assume<this['returning'], Record<string, unknown> | undefined>, Assume<this['nullabilityMap'], Record<string, JoinNullability>>, Assume<this['joins'], Join[]>, this['dynamic'], this['excludedMethods']>;
}
type PgUpdateKind<T extends PgUpdateHKTBase, TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TFrom extends PgTable | Subquery | PgViewBase | SQL | undefined = undefined, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = [], TDynamic extends boolean = false, TExcludedMethods extends string = never> = (T & {
  table: TTable;
  joins: TJoins;
  nullabilityMap: TNullabilityMap;
  queryResult: TQueryResult;
  from: TFrom;
  selectedFields: TSelectedFields;
  returning: TReturning;
  dynamic: TDynamic;
  excludedMethods: TExcludedMethods;
  result: TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[];
})['_type'];
type AnyPgUpdate = PgUpdateBase<any, any, any, any, any, any, any, any, any, any>;
interface PgUpdateBase<THKT extends PgUpdateHKTBase, TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TFrom extends PgTable | Subquery | PgViewBase | SQL | undefined = undefined, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = [], TDynamic extends boolean = false, TExcludedMethods extends string = never> extends TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, SQLWrapper {
  readonly _: {
    readonly dialect: 'pg';
    readonly hkt: THKT;
    readonly table: TTable;
    readonly joins: TJoins;
    readonly nullabilityMap: TNullabilityMap;
    readonly queryResult: TQueryResult;
    readonly from: TFrom;
    readonly selectedFields: TSelectedFields;
    readonly returning: TReturning;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
    readonly result: TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[];
  };
}
declare class PgUpdateBase<THKT extends PgUpdateHKTBase, TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TFrom extends PgTable | Subquery | PgViewBase | SQL | undefined = undefined, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = [], TDynamic extends boolean = false, TExcludedMethods extends string = never> implements SQLWrapper {
  protected session: PgSession;
  protected dialect: PgDialect;
  static readonly [entityKind]: string;
  protected config: PgUpdateConfig;
  protected tableName: string | undefined;
  protected joinsNotNullableMap: Record<string, boolean>;
  protected cacheConfig?: WithCacheConfig;
  constructor(table: TTable, set: UpdateSet, session: PgSession, dialect: PgDialect, withList?: Subquery[]);
  from<TFrom extends PgTable | Subquery | PgViewBase | SQL>(source: TableLikeHasEmptySelection<TFrom> extends true ? DrizzleTypeError<"Cannot reference a data-modifying statement subquery if it doesn't contain a `returning` clause"> : TFrom): PgUpdateWithJoins<this, TDynamic, TFrom>;
  private getTableLikeFields;
  private createJoin;
  leftJoin: PgUpdateJoinFn<this, TDynamic, "left">;
  rightJoin: PgUpdateJoinFn<this, TDynamic, "right">;
  innerJoin: PgUpdateJoinFn<this, TDynamic, "inner">;
  fullJoin: PgUpdateJoinFn<this, TDynamic, "full">;
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
  where(where: SQL | undefined): PgUpdateWithout<this, TDynamic, 'where'>;
  /**
   * Adds a `returning` clause to the query.
   *
   * Calling this method will return the specified fields of the updated rows. If no fields are specified, all fields will be returned.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update#update-with-returning}
   *
   * @example
   * ```ts
   * // Update all cars with the green color and return all fields
   * const updatedCars: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.color, 'green'))
   *   .returning();
   *
   * // Update all cars with the green color and return only their id and brand fields
   * const updatedCarsIdsAndBrands: { id: number, brand: string }[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.color, 'green'))
   *   .returning({ id: cars.id, brand: cars.brand });
   * ```
   */
  returning(): PgUpdateReturningAll<this, TDynamic>;
  returning<TSelectedFields extends SelectedFields>(fields: TSelectedFields): PgUpdateReturning<this, TDynamic, TSelectedFields>;
  toSQL(): Query;
  $dynamic(): PgUpdateDynamic<this>;
}
//#endregion
export { AnyPgUpdate, Join, PgUpdate, PgUpdateBase, PgUpdateBuilder, PgUpdateBuilderConstructor, PgUpdateConfig, PgUpdateDynamic, PgUpdateHKT, PgUpdateHKTBase, PgUpdateJoin, PgUpdateJoinFn, PgUpdateKind, PgUpdateReturning, PgUpdateReturningAll, PgUpdateSetSource, PgUpdateWithJoins, PgUpdateWithout };
//# sourceMappingURL=update.d.cts.map