import { SelectedFields } from "../query-builders/select.types.js";
import "../columns/index.js";
import { PgColumn } from "../columns/common.js";
import { PgViewBase } from "../view-base.js";
import { WithBuilder } from "../subquery.js";
import { PgMaterializedView } from "../view.js";
import { _RelationalQueryBuilder } from "../query-builders/_query.js";
import { RelationalQueryBuilder } from "../query-builders/query.js";
import { PgAsyncDeleteBase } from "./delete.js";
import { PgAsyncInsertHKT } from "./insert.js";
import { PgAsyncRelationalQueryHKT } from "./query.js";
import { PgAsyncRaw } from "./raw.js";
import { PgAsyncRefreshMaterializedView } from "./refresh-materialized-view.js";
import { PgAsyncSelectBuilder } from "./select.js";
import { PgAsyncUpdateHKT } from "./update.js";
import { PgAsyncCountBuilder } from "./count.js";
import { entityKind } from "../../entity.js";
import { WithSubquery } from "../../subquery.js";
import { DrizzleTypeError } from "../../utils.js";
import { SQL, SQLWrapper } from "../../sql/sql.js";
import * as V1 from "../../_relations.js";
import { PgDialect } from "../dialect.js";
import { PgAsyncSession, PgAsyncTransaction } from "./session.js";
import { Cache } from "../../cache/core/cache.js";
import { AnyRelations, EmptyRelations } from "../../relations.js";
import { PgTable } from "../table.js";
import { PgInsertBuilder, PgUpdateBuilder } from "../query-builders/index.js";
import { PgQueryResultHKT, PgQueryResultKind, PgTransactionConfig } from "../session.js";

//#region src/pg-core/async/db.d.ts
declare class PgAsyncDatabase<TQueryResult extends PgQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = V1.ExtractTablesWithRelations<TFullSchema>> {
  static readonly [entityKind]: string;
  readonly _: {
    readonly schema: TSchema | undefined;
    readonly fullSchema: TFullSchema;
    readonly tableNamesMap: Record<string, string>;
    readonly relations: TRelations;
    readonly session: PgAsyncSession<TQueryResult, TFullSchema, TRelations, TSchema>;
  };
  /** @deprecated */
  _query: TFullSchema extends Record<string, never> ? DrizzleTypeError<'Seems like the schema generic is missing - did you forget to add it to your DB type?'> : { [K in keyof TSchema]: _RelationalQueryBuilder<TSchema, TSchema[K]> };
  query: { [K in keyof TRelations]: RelationalQueryBuilder<TRelations, TRelations[K], PgAsyncRelationalQueryHKT> };
  constructor(/** @internal */
  dialect: PgDialect, /** @internal */
  session: PgAsyncSession<any, any, any, any>, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, parseRqbJson?: boolean);
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
  $count(source: PgTable | PgViewBase | SQL | SQLWrapper, filters?: SQL<unknown>): PgAsyncCountBuilder;
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
      (): PgAsyncSelectBuilder<undefined>;
      <TSelection extends SelectedFields>(fields: TSelection): PgAsyncSelectBuilder<TSelection>;
    };
    selectDistinct: {
      (): PgAsyncSelectBuilder<undefined>;
      <TSelection extends SelectedFields>(fields: TSelection): PgAsyncSelectBuilder<TSelection>;
    };
    selectDistinctOn: {
      (on: (PgColumn | SQLWrapper)[]): PgAsyncSelectBuilder<undefined>;
      <TSelection extends SelectedFields>(on: (PgColumn | SQLWrapper)[], fields: TSelection): PgAsyncSelectBuilder<TSelection>;
    };
    update: <TTable extends PgTable>(table: TTable) => PgUpdateBuilder<TTable, TQueryResult, PgAsyncUpdateHKT>;
    insert: <TTable extends PgTable>(table: TTable) => PgInsertBuilder<TTable, TQueryResult, false, PgAsyncInsertHKT>;
    delete: <TTable extends PgTable>(table: TTable) => PgAsyncDeleteBase<TTable, TQueryResult>;
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
  select(): PgAsyncSelectBuilder<undefined>;
  select<TSelection extends SelectedFields>(fields: TSelection): PgAsyncSelectBuilder<TSelection>;
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
  selectDistinct(): PgAsyncSelectBuilder<undefined>;
  selectDistinct<TSelection extends SelectedFields>(fields: TSelection): PgAsyncSelectBuilder<TSelection>;
  /**
   * Adds `distinct on` expression to the select query.
   *
   * Calling this method will specify how the unique rows are determined.
   *
   * Use `.from()` method to specify which table to select from.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#distinct}
   *
   * @param on The expression defining uniqueness.
   * @param fields The selection object.
   *
   * @example
   * ```ts
   * // Select the first row for each unique brand from the 'cars' table
   * await db.selectDistinctOn([cars.brand])
   *   .from(cars)
   *   .orderBy(cars.brand);
   *
   * // Selects the first occurrence of each unique car brand along with its color from the 'cars' table
   * await db.selectDistinctOn([cars.brand], { brand: cars.brand, color: cars.color })
   *   .from(cars)
   *   .orderBy(cars.brand, cars.color);
   * ```
   */
  selectDistinctOn(on: (PgColumn | SQLWrapper)[]): PgAsyncSelectBuilder<undefined>;
  selectDistinctOn<TSelection extends SelectedFields>(on: (PgColumn | SQLWrapper)[], fields: TSelection): PgAsyncSelectBuilder<TSelection>;
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
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update<TTable extends PgTable>(table: TTable): PgUpdateBuilder<TTable, TQueryResult, PgAsyncUpdateHKT>;
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
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert<TTable extends PgTable>(table: TTable): PgInsertBuilder<TTable, TQueryResult, false, PgAsyncInsertHKT>;
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
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete<TTable extends PgTable>(table: TTable): PgAsyncDeleteBase<TTable, TQueryResult>;
  refreshMaterializedView<TView extends PgMaterializedView>(view: TView): PgAsyncRefreshMaterializedView<TQueryResult>;
  execute<TRow extends Record<string, unknown> = Record<string, unknown>>(query: SQLWrapper | string): PgAsyncRaw<PgQueryResultKind<TQueryResult, TRow>>;
  transaction<T>(transaction: (tx: PgAsyncTransaction<TQueryResult, TFullSchema, TRelations, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
type PgAsyncWithReplicas<Q> = Q & {
  $primary: Q;
  $replicas: Q[];
};
declare const withReplicas: <HKT extends PgQueryResultHKT, TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig, Q extends PgAsyncDatabase<HKT, TFullSchema, TRelations, TSchema extends Record<string, unknown> ? V1.ExtractTablesWithRelations<TFullSchema> : TSchema>>(primary: Q, replicas: [Q, ...Q[]], getReplica?: (replicas: Q[]) => Q) => PgAsyncWithReplicas<Q>;
//#endregion
export { PgAsyncDatabase, PgAsyncWithReplicas, withReplicas };
//# sourceMappingURL=db.d.ts.map