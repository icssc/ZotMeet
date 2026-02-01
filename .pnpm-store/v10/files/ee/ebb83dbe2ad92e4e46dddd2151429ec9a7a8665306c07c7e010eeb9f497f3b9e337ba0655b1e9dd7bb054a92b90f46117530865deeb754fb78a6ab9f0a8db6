import { MsSqlViewBase } from "../view-base.cjs";
import { CreateMsSqlSelectFromBuilderMode, GetMsSqlSetOperators, MsSqlCreateSetOperatorFn, MsSqlJoinFn, MsSqlSelectConfig, MsSqlSelectDynamic, MsSqlSelectHKT, MsSqlSelectHKTBase, MsSqlSelectPrepare, MsSqlSelectReplace, MsSqlSelectWithout, MsSqlSetOperatorExcludedMethods, MsSqlSetOperatorWithResult, SelectedFields, SetOperatorRightSelect } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { BuildSubquerySelection, GetSelectTableName, GetSelectTableSelection, JoinNullability, SelectMode, SelectResult } from "../../query-builders/select.types.cjs";
import { ColumnsSelection, Placeholder, Query, SQL } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { ValueOrArray } from "../../utils.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { MsSqlColumn } from "../columns/index.cjs";
import { MsSqlTable } from "../table.cjs";
import { MsSqlDialect } from "../dialect.cjs";
import { MsSqlSession, PreparedQueryHKTBase } from "../session.cjs";
import { SubqueryWithSelection } from "../subquery.cjs";

//#region src/mssql-core/query-builders/select.d.ts
declare class MsSqlSelectFromBuilderBase<TSelection extends SelectedFields | undefined, TPreparedQueryHKT extends PreparedQueryHKTBase, TBuilderMode extends 'db' | 'qb', TBranch extends 'from' | 'top'> {
  static readonly [entityKind]: string;
  protected fields: TSelection;
  protected session: MsSqlSession | undefined;
  protected dialect: MsSqlDialect;
  protected withList: Subquery[];
  protected distinct: boolean | undefined;
  protected topValue?: number | Placeholder;
  constructor(config: {
    fields: TSelection;
    session: MsSqlSession | undefined;
    dialect: MsSqlDialect;
    withList?: Subquery[];
    distinct?: boolean;
    topValue?: number | Placeholder;
  });
  from<TFrom extends MsSqlTable | Subquery | MsSqlViewBase | SQL>(source: TFrom): Omit<CreateMsSqlSelectFromBuilderMode<TBuilderMode, GetSelectTableName<TFrom>, TSelection extends undefined ? GetSelectTableSelection<TFrom> : TSelection, TSelection extends undefined ? 'single' : 'partial', TPreparedQueryHKT, TBranch>, 'fetch' | 'offset'>;
}
declare class MsSqlSelectBuilder<TSelection extends SelectedFields | undefined, TPreparedQueryHKT extends PreparedQueryHKTBase, TBuilderMode extends 'db' | 'qb' = 'db'> extends MsSqlSelectFromBuilderBase<TSelection, TPreparedQueryHKT, TBuilderMode, 'from'> {
  static readonly [entityKind]: string;
  top(top: number | Placeholder): MsSqlSelectFromBuilderBase<TSelection, TPreparedQueryHKT, TBuilderMode, 'top'>;
}
declare abstract class MsSqlSelectQueryBuilderBase<THKT extends MsSqlSelectHKTBase, TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase, TBranch extends 'from' | 'top', TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = 'offset' | 'fetch', TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> extends TypedQueryBuilder<TSelectedFields, TResult> {
  static readonly [entityKind]: string;
  readonly _: {
    readonly hkt: THKT;
    readonly tableName: TTableName;
    readonly selection: TSelection;
    readonly selectMode: TSelectMode;
    readonly preparedQueryHKT: TPreparedQueryHKT;
    readonly nullabilityMap: TNullabilityMap;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
    readonly result: TResult;
    readonly selectedFields: TSelectedFields;
    readonly branch: TBranch;
  };
  protected config: MsSqlSelectConfig;
  protected joinsNotNullableMap: Record<string, boolean>;
  private tableName;
  private isPartialSelect;
  protected dialect: MsSqlDialect;
  constructor({
    table,
    fields,
    isPartialSelect,
    session,
    dialect,
    withList,
    distinct,
    topValue
  }: {
    table: MsSqlSelectConfig['table'];
    fields: MsSqlSelectConfig['fields'];
    isPartialSelect: boolean;
    session: MsSqlSession | undefined;
    dialect: MsSqlDialect;
    withList: Subquery[];
    distinct: boolean | undefined;
    topValue: number | undefined | Placeholder;
  });
  private createJoin;
  /**
   * Executes a `left join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet | null }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  leftJoin: MsSqlJoinFn<this, TDynamic, "left">;
  /**
   * Executes a `right join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  rightJoin: MsSqlJoinFn<this, TDynamic, "right">;
  /**
   * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  innerJoin: MsSqlJoinFn<this, TDynamic, "inner">;
  /**
   * Executes a `full join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet | null }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  fullJoin: MsSqlJoinFn<this, TDynamic, "full">;
  private createSetOperator;
  /**
   * Adds `union` set operator to the query.
   *
   * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
   *
   * @example
   *
   * ```ts
   * // Select all unique names from customers and users tables
   * await db.select({ name: users.name })
   *   .from(users)
   *   .union(
   *     db.select({ name: customers.name }).from(customers)
   *   );
   * // or
   * import { union } from 'drizzle-orm/mssql-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */
  union: <TValue extends MsSqlSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetMsSqlSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => MsSqlSelectWithout<this, TDynamic, MsSqlSetOperatorExcludedMethods, true>;
  /**
   * Adds `union all` set operator to the query.
   *
   * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
   *
   * @example
   *
   * ```ts
   * // Select all transaction ids from both online and in-store sales
   * await db.select({ transaction: onlineSales.transactionId })
   *   .from(onlineSales)
   *   .unionAll(
   *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   *   );
   * // or
   * import { unionAll } from 'drizzle-orm/mssql-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */
  unionAll: <TValue extends MsSqlSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetMsSqlSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => MsSqlSelectWithout<this, TDynamic, MsSqlSetOperatorExcludedMethods, true>;
  /**
   * Adds `intersect` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
   *
   * @example
   *
   * ```ts
   * // Select course names that are offered in both departments A and B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .intersect(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { intersect } from 'drizzle-orm/mssql-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  intersect: <TValue extends MsSqlSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetMsSqlSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => MsSqlSelectWithout<this, TDynamic, MsSqlSetOperatorExcludedMethods, true>;
  /**
   * Adds `except` set operator to the query.
   *
   * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
   *
   * @example
   *
   * ```ts
   * // Select all courses offered in department A but not in department B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .except(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { except } from 'drizzle-orm/mssql-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  except: <TValue extends MsSqlSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetMsSqlSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => MsSqlSelectWithout<this, TDynamic, MsSqlSetOperatorExcludedMethods, true>;
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where: ((aliases: this['_']['selection']) => SQL | undefined) | SQL | undefined): MsSqlSelectWithout<this, TDynamic, 'where'>;
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   *  brand: cars.brand,
   *  count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(having: ((aliases: this['_']['selection']) => SQL | undefined) | SQL | undefined): MsSqlSelectWithout<this, TDynamic, 'having'>;
  /**
   * Adds a `group by` clause to the query.
   *
   * Calling this method will group rows that have the same values into summary rows, often used for aggregation purposes.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @example
   *
   * ```ts
   * // Group and count people by their last names
   * await db.select({
   *    lastName: people.lastName,
   *    count: sql<number>`cast(count(*) as int)`
   * })
   *   .from(people)
   *   .groupBy(people.lastName);
   * ```
   */
  groupBy(builder: (aliases: this['_']['selection']) => ValueOrArray<MsSqlColumn | SQL | SQL.Aliased>): MsSqlSelectWithout<this, TDynamic, 'groupBy'>;
  groupBy(...columns: (MsSqlColumn | SQL | SQL.Aliased)[]): MsSqlSelectWithout<this, TDynamic, 'groupBy'>;
  /**
   * Adds an `order by` clause to the query.
   *
   * Calling this method will sort the result-set in ascending or descending order. By default, the sort order is ascending.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#order-by}
   *
   * @example
   *
   * ```
   * // Select cars ordered by year
   * await db.select().from(cars).orderBy(cars.year);
   * ```
   *
   * You can specify whether results are in ascending or descending order with the `asc()` and `desc()` operators.
   *
   * ```ts
   * // Select cars ordered by year in descending order
   * await db.select().from(cars).orderBy(desc(cars.year));
   *
   * // Select cars ordered by year and price
   * await db.select().from(cars).orderBy(asc(cars.year), desc(cars.price));
   * ```
   */
  orderBy(builder: (aliases: this['_']['selection']) => ValueOrArray<MsSqlColumn | SQL | SQL.Aliased>): TBranch extends 'from' ? MsSqlSelectReplace<this, TDynamic, 'orderBy', 'offset'> : MsSqlSelectWithout<this, TDynamic, 'orderBy'>;
  orderBy(...columns: (MsSqlColumn | SQL | SQL.Aliased)[]): TBranch extends 'from' ? MsSqlSelectReplace<this, TDynamic, 'orderBy', 'offset'> : MsSqlSelectWithout<this, TDynamic, 'orderBy'>;
  /**
   * Adds an `OFFSET` clause to the query.
   *
   * Calling this method will skip the first N rows of the result set. This is commonly used for pagination, often in combination with `FETCH NEXT` (e.g., `.fetch()`).
   *
   *  * ⚠️ **Note:** This method can only be used after calling `.orderBy()`, as SQL Server requires `ORDER BY` to be present with `OFFSET`.
   *
   * @example
   *
   * ```ts
   * // Skip the first 10 results
   * await db.select().from(cars).orderBy(cars.year).offset(10);
   * ```
   *
   * `OFFSET` is zero-based — `offset(0)` will include all rows, while `offset(10)` will skip the first 10.
   *
   * Typically used with `.fetch()` to implement pagination:
   *
   * ```ts
   * // Get 10 cars, skipping the first 20
   * await db.select().from(cars).orderBy(cars.year).offset(20).fetch(10);
   * ```
   *
   * @param offset The number of rows to skip
   */
  offset(offset: number | Placeholder): MsSqlSelectReplace<this, TDynamic, 'offset', 'fetch'>;
  /**
   * Adds a `FETCH NEXT` clause to the query (commonly known as `LIMIT`).
   *
   * Limits the number of rows returned — used after `.offset()`.
   *
   * @example
   * ```ts
   * // Get only 10 rows, skipping 5 rows
   * await db.select().from(cars).orderBy(cars.year).offset(5).fetch(10);
   * ```
   *
   * @example
   * ```ts
   * // Pagination: skip 20 cars, then fetch 10
   * await db.select().from(cars).orderBy(cars.year).offset(20).fetch(10);
   * ```
   *
   * @param fetch The number of rows to fetch
   */
  fetch(fetch: number | Placeholder): MsSqlSelectWithout<this, TDynamic, 'fetch'>;
  toSQL(): Query;
  as<TAlias extends string>(alias: TAlias): SubqueryWithSelection<this['_']['selectedFields'], TAlias>;
  $dynamic(): MsSqlSelectDynamic<this>;
}
interface MsSqlSelectBase<TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase, TBranch extends 'from' | 'top', TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = 'offset' | 'fetch', TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> extends MsSqlSelectQueryBuilderBase<MsSqlSelectHKT, TTableName, TSelection, TSelectMode, TPreparedQueryHKT, TBranch, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, QueryPromise<TResult> {}
declare class MsSqlSelectBase<TTableName extends string | undefined, TSelection, TSelectMode extends SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase, TBranch extends 'from' | 'top', TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = 'offset' | 'fetch', TResult = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields = BuildSubquerySelection<TSelection, TNullabilityMap>> extends MsSqlSelectQueryBuilderBase<MsSqlSelectHKT, TTableName, TSelection, TSelectMode, TPreparedQueryHKT, TBranch, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields> {
  static readonly [entityKind]: string;
  prepare(): MsSqlSelectPrepare<this>;
  execute: ReturnType<this["prepare"]>["execute"];
  private createIterator;
  iterator: ReturnType<this["prepare"]>["iterator"];
}
/**
 * Adds `union` set operator to the query.
 *
 * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
 *
 * @example
 *
 * ```ts
 * // Select all unique names from customers and users tables
 * import { union } from 'drizzle-orm/mssql-core'
 *
 * await union(
 *   db.select({ name: users.name }).from(users),
 *   db.select({ name: customers.name }).from(customers)
 * );
 * // or
 * await db.select({ name: users.name })
 *   .from(users)
 *   .union(
 *     db.select({ name: customers.name }).from(customers)
 *   );
 * ```
 */
declare const union: MsSqlCreateSetOperatorFn;
/**
 * Adds `union all` set operator to the query.
 *
 * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
 *
 * @example
 *
 * ```ts
 * // Select all transaction ids from both online and in-store sales
 * import { unionAll } from 'drizzle-orm/mssql-core'
 *
 * await unionAll(
 *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
 *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
 * );
 * // or
 * await db.select({ transaction: onlineSales.transactionId })
 *   .from(onlineSales)
 *   .unionAll(
 *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
 *   );
 * ```
 */
declare const unionAll: MsSqlCreateSetOperatorFn;
/**
 * Adds `intersect` set operator to the query.
 *
 * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
 *
 * @example
 *
 * ```ts
 * // Select course names that are offered in both departments A and B
 * import { intersect } from 'drizzle-orm/mssql-core'
 *
 * await intersect(
 *   db.select({ courseName: depA.courseName }).from(depA),
 *   db.select({ courseName: depB.courseName }).from(depB)
 * );
 * // or
 * await db.select({ courseName: depA.courseName })
 *   .from(depA)
 *   .intersect(
 *     db.select({ courseName: depB.courseName }).from(depB)
 *   );
 * ```
 */
declare const intersect: MsSqlCreateSetOperatorFn;
/**
 * Adds `except` set operator to the query.
 *
 * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
 *
 * @example
 *
 * ```ts
 * // Select all courses offered in department A but not in department B
 * import { except } from 'drizzle-orm/mssql-core'
 *
 * await except(
 *   db.select({ courseName: depA.courseName }).from(depA),
 *   db.select({ courseName: depB.courseName }).from(depB)
 * );
 * // or
 * await db.select({ courseName: depA.courseName })
 *   .from(depA)
 *   .except(
 *     db.select({ courseName: depB.courseName }).from(depB)
 *   );
 * ```
 */
declare const except: MsSqlCreateSetOperatorFn;
//#endregion
export { MsSqlSelectBase, MsSqlSelectBuilder, MsSqlSelectQueryBuilderBase, except, intersect, union, unionAll };
//# sourceMappingURL=select.d.cts.map