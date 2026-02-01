import { GetPgSetOperators, LockConfig, LockStrength, PgCreateSetOperatorFn, PgSelectConfig, PgSelectCrossJoinFn, PgSelectDynamic, PgSelectHKTBase, PgSelectJoinFn, PgSelectKind, PgSelectQueryBuilderHKT, PgSelectWithout, PgSetOperatorExcludedMethods, PgSetOperatorWithResult, SelectedFields, SetOperatorRightSelect, TableLikeHasEmptySelection } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { BuildSubquerySelection, GetSelectTableName, GetSelectTableSelection, JoinNullability, SelectMode, SelectResult } from "../../query-builders/select.types.cjs";
import { ColumnsSelection, Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { Assume, DrizzleTypeError, ValueOrArray } from "../../utils.cjs";
import { CacheConfig, WithCacheConfig } from "../../cache/core/types.cjs";
import { PgColumn } from "../columns/index.cjs";
import { PgTable } from "../table.cjs";
import { PgViewBase } from "../view-base.cjs";
import { PgDialect } from "../dialect.cjs";
import { PgSession } from "../session.cjs";
import { SubqueryWithSelection } from "../subquery.cjs";

//#region src/pg-core/query-builders/select.d.ts
interface PgSelectBuilder<TSelection extends SelectedFields | undefined, THKT extends PgSelectHKTBase = PgSelectQueryBuilderHKT> {
  /**
   * Specify the table, subquery, or other target that you're
   * building a select query against.
   *
   * {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM | Postgres from documentation}
   */
  from: PgSelectBase<THKT, undefined, TSelection, SelectMode>['from'];
}
type PgSelect<TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = PgSelectBase<PgSelectQueryBuilderHKT, TTableName, TSelection, TSelectMode, TNullabilityMap, true, never>;
type PgSelectQueryBuilder<THKT extends PgSelectHKTBase = PgSelectQueryBuilderHKT, TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = ColumnsSelection, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>, TResult extends any[] = unknown[], TSelectedFields extends ColumnsSelection = ColumnsSelection> = PgSelectBase<THKT, TTableName, TSelection, TSelectMode, TNullabilityMap, true, never, TResult, TSelectedFields>;
declare class PgSelectBase<THKT extends PgSelectHKTBase, TTableName extends string | undefined, TSelection extends ColumnsSelection | undefined, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<Assume<TSelection, ColumnsSelection>, TNullabilityMap>> extends TypedQueryBuilder<TSelectedFields, TResult> {
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'pg';
    readonly hkt: THKT;
    readonly tableName: TTableName;
    readonly selection: TSelection;
    readonly selectMode: TSelectMode;
    readonly nullabilityMap: TNullabilityMap;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
    readonly result: TResult;
    readonly selectedFields: TSelectedFields;
    readonly config: PgSelectConfig;
  };
  protected config: PgSelectConfig;
  protected joinsNotNullableMap: Record<string, boolean>;
  protected tableName: string | undefined;
  protected isPartialSelect: boolean;
  protected session: PgSession | undefined;
  protected dialect: PgDialect;
  protected cacheConfig?: WithCacheConfig;
  protected usedTables: Set<string>;
  constructor(config: {
    fields: TSelection;
    session: PgSession | undefined;
    dialect: PgDialect;
    withList?: Subquery[];
    distinct?: boolean | {
      on: (PgColumn | SQLWrapper)[];
    };
  });
  /**
   * Specify the table, subquery, or other target that you're
   * building a select query against.
   *
   * {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM | Postgres from documentation}
   */
  from<TFrom extends PgTable | Subquery | PgViewBase | SQL, TConfig extends Record<string, any> = {
    tableName: GetSelectTableName<TFrom>;
    selection: TSelection extends undefined ? GetSelectTableSelection<TFrom> : TSelection;
    selectMode: TSelection extends undefined ? 'single' : 'partial';
    nullabilityMap: GetSelectTableName<TFrom> extends string ? Record<GetSelectTableName<TFrom>, 'not-null'> : {};
  }>(source: TableLikeHasEmptySelection<TFrom> extends true ? DrizzleTypeError<"Cannot reference a data-modifying statement subquery if it doesn't contain a `returning` clause"> : TFrom): Omit<PgSelectKind<THKT, TConfig['tableName'], TConfig['selection'], TConfig['selectMode'], TConfig['tableName'] extends string ? Record<TConfig['tableName'], 'not-null'> : {}, false, 'from'>, 'from'>;
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
   * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  leftJoin: PgSelectJoinFn<this, TDynamic, "left", false>;
  /**
   * Executes a `left join lateral` operation by adding subquery to the current query.
   *
   * A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join-lateral}
   *
   * @param table the subquery to join.
   * @param on the `on` clause.
   */
  leftJoinLateral: PgSelectJoinFn<this, TDynamic, "left", true>;
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
   * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  rightJoin: PgSelectJoinFn<this, TDynamic, "right", false>;
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
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  innerJoin: PgSelectJoinFn<this, TDynamic, "inner", false>;
  /**
   * Executes an `inner join lateral` operation, creating a new table by combining rows from two queries that have matching values.
   *
   * A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join-lateral}
   *
   * @param table the subquery to join.
   * @param on the `on` clause.
   */
  innerJoinLateral: PgSelectJoinFn<this, TDynamic, "inner", true>;
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
   * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  fullJoin: PgSelectJoinFn<this, TDynamic, "full", false>;
  /**
   * Executes a `cross join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
   *
   * @param table the table to join.
   *
   * @example
   *
   * ```ts
   * // Select all users, each user with every pet
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .crossJoin(pets)
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .crossJoin(pets)
   * ```
   */
  crossJoin: PgSelectCrossJoinFn<this, TDynamic, false>;
  /**
   * Executes a `cross join lateral` operation by combining rows from two queries into a new table.
   *
   * A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
   *
   * Calling this method retrieves all rows from both main and joined queries, merging all rows from each query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join-lateral}
   *
   * @param table the query to join.
   */
  crossJoinLateral: PgSelectCrossJoinFn<this, TDynamic, true>;
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
   * import { union } from 'drizzle-orm/pg-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */
  union: <TValue extends PgSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetPgSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => PgSelectWithout<this, TDynamic, PgSetOperatorExcludedMethods, true>;
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
   * import { unionAll } from 'drizzle-orm/pg-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */
  unionAll: <TValue extends PgSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetPgSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => PgSelectWithout<this, TDynamic, PgSetOperatorExcludedMethods, true>;
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
   * import { intersect } from 'drizzle-orm/pg-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  intersect: <TValue extends PgSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetPgSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => PgSelectWithout<this, TDynamic, PgSetOperatorExcludedMethods, true>;
  /**
   * Adds `intersect all` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets including all duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect-all}
   *
   * @example
   *
   * ```ts
   * // Select all products and quantities that are ordered by both regular and VIP customers
   * await db.select({
   *   productId: regularCustomerOrders.productId,
   *   quantityOrdered: regularCustomerOrders.quantityOrdered
   * })
   * .from(regularCustomerOrders)
   * .intersectAll(
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * // or
   * import { intersectAll } from 'drizzle-orm/pg-core'
   *
   * await intersectAll(
   *   db.select({
   *     productId: regularCustomerOrders.productId,
   *     quantityOrdered: regularCustomerOrders.quantityOrdered
   *   })
   *   .from(regularCustomerOrders),
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * ```
   */
  intersectAll: <TValue extends PgSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetPgSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => PgSelectWithout<this, TDynamic, PgSetOperatorExcludedMethods, true>;
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
   * import { except } from 'drizzle-orm/pg-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  except: <TValue extends PgSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetPgSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => PgSelectWithout<this, TDynamic, PgSetOperatorExcludedMethods, true>;
  /**
   * Adds `except all` set operator to the query.
   *
   * Calling this method will retrieve all rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except-all}
   *
   * @example
   *
   * ```ts
   * // Select all products that are ordered by regular customers but not by VIP customers
   * await db.select({
   *   productId: regularCustomerOrders.productId,
   *   quantityOrdered: regularCustomerOrders.quantityOrdered,
   * })
   * .from(regularCustomerOrders)
   * .exceptAll(
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered,
   *   })
   *   .from(vipCustomerOrders)
   * );
   * // or
   * import { exceptAll } from 'drizzle-orm/pg-core'
   *
   * await exceptAll(
   *   db.select({
   *     productId: regularCustomerOrders.productId,
   *     quantityOrdered: regularCustomerOrders.quantityOrdered
   *   })
   *   .from(regularCustomerOrders),
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * ```
   */
  exceptAll: <TValue extends PgSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetPgSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => PgSelectWithout<this, TDynamic, PgSetOperatorExcludedMethods, true>;
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
  where(where: ((aliases: this['_']['selection']) => SQL | undefined) | SQL | undefined): PgSelectWithout<this, TDynamic, 'where'>;
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
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(having: ((aliases: this['_']['selection']) => SQL | undefined) | SQL | undefined): PgSelectWithout<this, TDynamic, 'having'>;
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
  groupBy(builder: (aliases: this['_']['selection']) => ValueOrArray<PgColumn | SQL | SQL.Aliased>): PgSelectWithout<this, TDynamic, 'groupBy'>;
  groupBy(...columns: (PgColumn | SQL | SQL.Aliased)[]): PgSelectWithout<this, TDynamic, 'groupBy'>;
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
  orderBy(builder: (aliases: this['_']['selection']) => ValueOrArray<PgColumn | SQL | SQL.Aliased>): PgSelectWithout<this, TDynamic, 'orderBy'>;
  orderBy(...columns: (PgColumn | SQL | SQL.Aliased)[]): PgSelectWithout<this, TDynamic, 'orderBy'>;
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(limit: number | Placeholder): PgSelectWithout<this, TDynamic, 'limit'>;
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(offset: number | Placeholder): PgSelectWithout<this, TDynamic, 'offset'>;
  /**
   * Adds a `for` clause to the query.
   *
   * Calling this method will specify a lock strength for this query that controls how strictly it acquires exclusive access to the rows being queried.
   *
   * See docs: {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE}
   *
   * @param strength the lock strength.
   * @param config the lock configuration.
   */
  for(strength: LockStrength, config?: LockConfig): PgSelectWithout<this, TDynamic, 'for'>;
  toSQL(): Query;
  as<TAlias extends string>(alias: TAlias): SubqueryWithSelection<this['_']['selectedFields'], TAlias>;
  $dynamic(): PgSelectDynamic<this>;
  $withCache(config?: {
    config?: CacheConfig;
    tag?: string;
    autoInvalidate?: boolean;
  } | false): this;
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
 * import { union } from 'drizzle-orm/pg-core'
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
declare const union: PgCreateSetOperatorFn;
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
 * import { unionAll } from 'drizzle-orm/pg-core'
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
declare const unionAll: PgCreateSetOperatorFn;
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
 * import { intersect } from 'drizzle-orm/pg-core'
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
declare const intersect: PgCreateSetOperatorFn;
/**
 * Adds `intersect all` set operator to the query.
 *
 * Calling this method will retain only the rows that are present in both result sets including all duplicates.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect-all}
 *
 * @example
 *
 * ```ts
 * // Select all products and quantities that are ordered by both regular and VIP customers
 * import { intersectAll } from 'drizzle-orm/pg-core'
 *
 * await intersectAll(
 *   db.select({
 *     productId: regularCustomerOrders.productId,
 *     quantityOrdered: regularCustomerOrders.quantityOrdered
 *   })
 *   .from(regularCustomerOrders),
 *   db.select({
 *     productId: vipCustomerOrders.productId,
 *     quantityOrdered: vipCustomerOrders.quantityOrdered
 *   })
 *   .from(vipCustomerOrders)
 * );
 * // or
 * await db.select({
 *   productId: regularCustomerOrders.productId,
 *   quantityOrdered: regularCustomerOrders.quantityOrdered
 * })
 * .from(regularCustomerOrders)
 * .intersectAll(
 *   db.select({
 *     productId: vipCustomerOrders.productId,
 *     quantityOrdered: vipCustomerOrders.quantityOrdered
 *   })
 *   .from(vipCustomerOrders)
 * );
 * ```
 */
declare const intersectAll: PgCreateSetOperatorFn;
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
 * import { except } from 'drizzle-orm/pg-core'
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
declare const except: PgCreateSetOperatorFn;
/**
 * Adds `except all` set operator to the query.
 *
 * Calling this method will retrieve all rows from the left query, except for the rows that are present in the result set of the right query.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#except-all}
 *
 * @example
 *
 * ```ts
 * // Select all products that are ordered by regular customers but not by VIP customers
 * import { exceptAll } from 'drizzle-orm/pg-core'
 *
 * await exceptAll(
 *   db.select({
 *     productId: regularCustomerOrders.productId,
 *     quantityOrdered: regularCustomerOrders.quantityOrdered
 *   })
 *   .from(regularCustomerOrders),
 *   db.select({
 *     productId: vipCustomerOrders.productId,
 *     quantityOrdered: vipCustomerOrders.quantityOrdered
 *   })
 *   .from(vipCustomerOrders)
 * );
 * // or
 * await db.select({
 *   productId: regularCustomerOrders.productId,
 *   quantityOrdered: regularCustomerOrders.quantityOrdered,
 * })
 * .from(regularCustomerOrders)
 * .exceptAll(
 *   db.select({
 *     productId: vipCustomerOrders.productId,
 *     quantityOrdered: vipCustomerOrders.quantityOrdered,
 *   })
 *   .from(vipCustomerOrders)
 * );
 * ```
 */
declare const exceptAll: PgCreateSetOperatorFn;
//#endregion
export { PgSelect, PgSelectBase, PgSelectBuilder, PgSelectQueryBuilder, except, exceptAll, intersect, intersectAll, union, unionAll };
//# sourceMappingURL=select.d.cts.map