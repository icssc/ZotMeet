import { MySqlDeleteBase } from "./query-builders/delete.js";
import { MySqlTable } from "./table.js";
import { MySqlViewBase } from "./view-base.js";
import { MySqlSelectBuilder } from "./query-builders/select.js";
import { MySqlUpdateBuilder } from "./query-builders/update.js";
import { MySqlInsertBuilder } from "./query-builders/insert.js";
import { MySqlDialect } from "./dialect.js";
import { _RelationalQueryBuilder } from "./query-builders/_query.js";
import { MySqlCountBuilder } from "./query-builders/count.js";
import "./query-builders/index.js";
import { RelationalQueryBuilder } from "./query-builders/query.js";
import { WithBuilder } from "./subquery.js";
import { Mode, MySqlQueryResultHKT, MySqlQueryResultKind, MySqlSession, MySqlTransaction, MySqlTransactionConfig, PreparedQueryHKTBase } from "./session.js";
import { SelectedFields } from "./query-builders/select.types.js";
import { entityKind } from "../entity.js";
import { WithSubquery } from "../subquery.js";
import { DrizzleTypeError } from "../utils.js";
import { SQL, SQLWrapper } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Cache } from "../cache/core/cache.js";
import { ResultSetHeader } from "mysql2/promise";
import { AnyRelations, EmptyRelations } from "../relations.js";

//#region src/mysql-core/db.d.ts
declare class MySqlDatabase<TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = V1.ExtractTablesWithRelations<TFullSchema>> {
  protected readonly mode: Mode;
  static readonly [entityKind]: string;
  readonly _: {
    readonly schema: TSchema | undefined;
    readonly fullSchema: TFullSchema;
    readonly relations: TRelations;
    readonly tableNamesMap: Record<string, string>;
  };
  /** @deprecated */
  _query: TFullSchema extends Record<string, never> ? DrizzleTypeError<'Seems like the schema generic is missing - did you forget to add it to your DB type?'> : { [K in keyof TSchema]: _RelationalQueryBuilder<TPreparedQueryHKT, TSchema, TSchema[K]> };
  query: { [K in keyof TRelations]: RelationalQueryBuilder<TPreparedQueryHKT, TRelations, TRelations[K]> };
  constructor(/** @internal */
  dialect: MySqlDialect, /** @internal */
  session: MySqlSession<any, any, any, any, any>, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, mode: Mode);
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with: WithBuilder;
  $count(source: MySqlTable | MySqlViewBase | SQL | SQLWrapper, filters?: SQL<unknown>): MySqlCountBuilder<MySqlSession<any, any, any, any, any>>;
  $cache: {
    invalidate: Cache['onMutate'];
  };
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...queries: WithSubquery[]): {
    select: {
      (): MySqlSelectBuilder<undefined, TPreparedQueryHKT>;
      <TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, TPreparedQueryHKT>;
    };
    selectDistinct: {
      (): MySqlSelectBuilder<undefined, TPreparedQueryHKT>;
      <TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, TPreparedQueryHKT>;
    };
    update: <TTable extends MySqlTable>(table: TTable) => MySqlUpdateBuilder<TTable, TQueryResult, TPreparedQueryHKT>;
    delete: <TTable extends MySqlTable>(table: TTable) => MySqlDeleteBase<TTable, TQueryResult, TPreparedQueryHKT>;
  };
  /**
   * Creates a select query.
   *
   * Calling this method with no arguments will select all columns from the table. Pass a selection object to specify the columns you want to select.
   *
   * Use `.from()` method to specify which table to select from.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select}
   *
   * @param fields The selection object.
   *
   * @example
   *
   * ```ts
   * // Select all columns and all rows from the 'cars' table
   * const allCars: Car[] = await db.select().from(cars);
   *
   * // Select specific columns and all rows from the 'cars' table
   * const carsIdsAndBrands: { id: number; brand: string }[] = await db.select({
   *   id: cars.id,
   *   brand: cars.brand
   * })
   *   .from(cars);
   * ```
   *
   * Like in SQL, you can use arbitrary expressions as selection fields, not just table columns:
   *
   * ```ts
   * // Select specific columns along with expression and all rows from the 'cars' table
   * const carsIdsAndLowerNames: { id: number; lowerBrand: string }[] = await db.select({
   *   id: cars.id,
   *   lowerBrand: sql<string>`lower(${cars.brand})`,
   * })
   *   .from(cars);
   * ```
   */
  select(): MySqlSelectBuilder<undefined, TPreparedQueryHKT>;
  select<TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, TPreparedQueryHKT>;
  /**
   * Adds `distinct` expression to the select query.
   *
   * Calling this method will return only unique values. When multiple columns are selected, it returns rows with unique combinations of values in these columns.
   *
   * Use `.from()` method to specify which table to select from.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#distinct}
   *
   * @param fields The selection object.
   *
   * @example
   * ```ts
   * // Select all unique rows from the 'cars' table
   * await db.selectDistinct()
   *   .from(cars)
   *   .orderBy(cars.id, cars.brand, cars.color);
   *
   * // Select all unique brands from the 'cars' table
   * await db.selectDistinct({ brand: cars.brand })
   *   .from(cars)
   *   .orderBy(cars.brand);
   * ```
   */
  selectDistinct(): MySqlSelectBuilder<undefined, TPreparedQueryHKT>;
  selectDistinct<TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, TPreparedQueryHKT>;
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   * ```
   */
  update<TTable extends MySqlTable>(table: TTable): MySqlUpdateBuilder<TTable, TQueryResult, TPreparedQueryHKT>;
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   * ```
   */
  insert<TTable extends MySqlTable>(table: TTable): MySqlInsertBuilder<TTable, TQueryResult, TPreparedQueryHKT>;
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   * ```
   */
  delete<TTable extends MySqlTable>(table: TTable): MySqlDeleteBase<TTable, TQueryResult, TPreparedQueryHKT>;
  execute<T extends {
    [column: string]: any;
  } = ResultSetHeader>(query: SQLWrapper | string): Promise<MySqlQueryResultKind<TQueryResult, T>>;
  transaction<T>(transaction: (tx: MySqlTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TRelations, TSchema>, config?: MySqlTransactionConfig) => Promise<T>, config?: MySqlTransactionConfig): Promise<T>;
}
type MySQLWithReplicas<Q> = Q & {
  $primary: Q;
  $replicas: Q[];
};
declare const withReplicas: <HKT extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig, Q extends MySqlDatabase<HKT, TPreparedQueryHKT, TFullSchema, TRelations, TSchema extends Record<string, unknown> ? V1.ExtractTablesWithRelations<TFullSchema> : TSchema>>(primary: Q, replicas: [Q, ...Q[]], getReplica?: (replicas: Q[]) => Q) => MySQLWithReplicas<Q>;
//#endregion
export { MySQLWithReplicas, MySqlDatabase, withReplicas };
//# sourceMappingURL=db.d.ts.map