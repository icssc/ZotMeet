import { CockroachMaterializedView } from "./view.js";
import { CockroachSession } from "./session.js";
import { entityKind } from "../entity.js";
import { Casing, UpdateSet } from "../utils.js";
import { QueryWithTypings, SQL } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { MigrationConfig, MigrationMeta, MigratorInitFailResponse } from "../migrator.js";
import { CockroachDeleteConfig, CockroachInsertConfig, CockroachUpdateConfig } from "./query-builders/index.js";
import { CockroachTable } from "./table.js";
import { CockroachColumn } from "./columns/index.js";
import { CockroachSelectConfig } from "./query-builders/select.types.js";

//#region src/cockroach-core/dialect.d.ts
interface CockroachDialectConfig {
  casing?: Casing;
}
declare class CockroachDialect {
  static readonly [entityKind]: string;
  constructor(config?: CockroachDialectConfig);
  migrate(migrations: MigrationMeta[], session: CockroachSession, config: string | MigrationConfig): Promise<void | MigratorInitFailResponse>;
  escapeName(name: string): string;
  escapeParam(num: number): string;
  escapeString(str: string): string;
  private buildWithCTE;
  buildDeleteQuery({
    table,
    where,
    returning,
    withList
  }: CockroachDeleteConfig): SQL;
  buildUpdateSet(table: CockroachTable, set: UpdateSet): SQL;
  buildUpdateQuery({
    table,
    set,
    where,
    returning,
    withList,
    from,
    joins
  }: CockroachUpdateConfig): SQL;
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  private buildSelection;
  private buildJoins;
  private buildFromTable;
  buildSelectQuery({
    withList,
    fields,
    fieldsFlat,
    where,
    having,
    table,
    joins,
    orderBy,
    groupBy,
    limit,
    offset,
    lockingClause,
    distinct,
    setOperators
  }: CockroachSelectConfig): SQL;
  buildSetOperations(leftSelect: SQL, setOperators: CockroachSelectConfig['setOperators']): SQL;
  buildSetOperationQuery({
    leftSelect,
    setOperator: {
      type,
      isAll,
      rightSelect,
      limit,
      orderBy,
      offset
    }
  }: {
    leftSelect: SQL;
    setOperator: CockroachSelectConfig['setOperators'][number];
  }): SQL;
  buildInsertQuery({
    table,
    values: valuesOrSelect,
    onConflict,
    returning,
    withList,
    select
  }: CockroachInsertConfig): SQL;
  buildRefreshMaterializedViewQuery({
    view,
    concurrently,
    withNoData
  }: {
    view: CockroachMaterializedView;
    concurrently?: boolean;
    withNoData?: boolean;
  }): SQL;
  sqlToQuery(sql: SQL, invokeSource?: 'indexes' | undefined): QueryWithTypings;
  buildRelationalQueryWithoutPK({
    fullSchema,
    schema,
    tableNamesMap,
    table,
    tableConfig,
    queryConfig: config,
    tableAlias,
    nestedQueryRelation,
    joinOn
  }: {
    fullSchema: Record<string, unknown>;
    schema: V1.TablesRelationalConfig;
    tableNamesMap: Record<string, string>;
    table: CockroachTable;
    tableConfig: V1.TableRelationalConfig;
    queryConfig: true | V1.DBQueryConfig<'many', true>;
    tableAlias: string;
    nestedQueryRelation?: V1.Relation;
    joinOn?: SQL;
  }): V1.BuildRelationalQueryResult<CockroachTable, CockroachColumn>;
}
//#endregion
export { CockroachDialect, CockroachDialectConfig };
//# sourceMappingURL=dialect.d.ts.map