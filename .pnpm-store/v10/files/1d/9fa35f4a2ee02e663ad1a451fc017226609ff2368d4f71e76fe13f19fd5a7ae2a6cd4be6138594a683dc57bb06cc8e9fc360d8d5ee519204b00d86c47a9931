import { MsSqlDeleteBase } from "./query-builders/delete.js";
import { MsSqlInsertBuilder } from "./query-builders/insert.js";
import { MsSqlUpdateBuilder } from "./query-builders/update.js";
import { MsSqlTable } from "./table.js";
import { MsSqlDialect } from "./dialect.js";
import { MsSqlSelectBuilder } from "./query-builders/select.js";
import { QueryBuilder } from "./query-builders/query-builder.js";
import "./query-builders/index.js";
import { RelationalQueryBuilder } from "./query-builders/query.js";
import { WithSubqueryWithSelection } from "./subquery.js";
import { MsSqlSession, MsSqlTransaction, MsSqlTransactionConfig, PreparedQueryHKTBase, QueryResultHKT, QueryResultKind } from "./session.js";
import { SelectedFields } from "./query-builders/select.types.js";
import { entityKind } from "../entity.js";
import { WithSubquery } from "../subquery.js";
import { DrizzleTypeError } from "../utils.js";
import { ColumnsSelection, SQLWrapper } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { TypedQueryBuilder } from "../query-builders/query-builder.js";

//#region src/mssql-core/db.d.ts
declare class MsSqlDatabase<TQueryResult extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = {}, TSchema extends V1.TablesRelationalConfig = V1.ExtractTablesWithRelations<TFullSchema>> {
  static readonly [entityKind]: string;
  readonly _: {
    readonly schema: TSchema | undefined;
    readonly tableNamesMap: Record<string, string>;
  };
  _query: TFullSchema extends Record<string, never> ? DrizzleTypeError<'Seems like the schema generic is missing - did you forget to add it to your DB type?'> : { [K in keyof TSchema]: RelationalQueryBuilder<TPreparedQueryHKT, TSchema, TSchema[K]> };
  constructor(/** @internal */
  dialect: MsSqlDialect, /** @internal */
  session: MsSqlSession<any, any, any, any>, schema: V1.RelationalSchemaConfig<TSchema> | undefined);
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
  $with<TAlias extends string>(alias: TAlias): {
    as<TSelection extends ColumnsSelection>(qb: TypedQueryBuilder<TSelection> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelection>)): WithSubqueryWithSelection<TSelection, TAlias>;
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
      (): MsSqlSelectBuilder<undefined, TPreparedQueryHKT>;
      <TSelection extends SelectedFields>(fields: TSelection): MsSqlSelectBuilder<TSelection, TPreparedQueryHKT>;
    };
    selectDistinct: {
      (): MsSqlSelectBuilder<undefined, TPreparedQueryHKT>;
      <TSelection extends SelectedFields>(fields: TSelection): MsSqlSelectBuilder<TSelection, TPreparedQueryHKT>;
    };
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
  select(): MsSqlSelectBuilder<undefined, TPreparedQueryHKT>;
  select<TSelection extends SelectedFields>(fields: TSelection): MsSqlSelectBuilder<TSelection, TPreparedQueryHKT>;
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
  selectDistinct(): MsSqlSelectBuilder<undefined, TPreparedQueryHKT>;
  selectDistinct<TSelection extends SelectedFields>(fields: TSelection): MsSqlSelectBuilder<TSelection, TPreparedQueryHKT>;
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
  update<TTable extends MsSqlTable>(table: TTable): MsSqlUpdateBuilder<TTable, TQueryResult, TPreparedQueryHKT>;
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
  insert<TTable extends MsSqlTable>(table: TTable): MsSqlInsertBuilder<TTable, TQueryResult, TPreparedQueryHKT>;
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
  delete<TTable extends MsSqlTable>(table: TTable): MsSqlDeleteBase<TTable, TQueryResult, TPreparedQueryHKT>;
  execute<T extends {
    [column: string]: any;
  } | {
    [column: string]: any;
  }[]>(query: SQLWrapper | string): Promise<QueryResultKind<TQueryResult, T>>;
  transaction<T>(transaction: (tx: MsSqlTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema>, config?: MsSqlTransactionConfig) => Promise<T>, config?: MsSqlTransactionConfig): Promise<T>;
}
type MySQLWithReplicas<Q> = Q & {
  $primary: Q;
};
declare const withReplicas: <HKT extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TFullSchema extends Record<string, unknown>, TSchema extends V1.TablesRelationalConfig, Q extends MsSqlDatabase<HKT, TPreparedQueryHKT, TFullSchema, TSchema extends Record<string, unknown> ? V1.ExtractTablesWithRelations<TFullSchema> : TSchema>>(primary: Q, replicas: [Q, ...Q[]], getReplica?: (replicas: Q[]) => Q) => MySQLWithReplicas<Q>;
//#endregion
export { MsSqlDatabase, MySQLWithReplicas, withReplicas };
//# sourceMappingURL=db.d.ts.map