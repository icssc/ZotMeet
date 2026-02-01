import { MySqlColumn } from "./columns/common.cjs";
import { MySqlDeleteConfig } from "./query-builders/delete.cjs";
import { MySqlTable } from "./table.cjs";
import { MySqlUpdateConfig } from "./query-builders/update.cjs";
import { MySqlInsertConfig } from "./query-builders/insert.cjs";
import { MySqlView } from "./view.cjs";
import { MySqlSession } from "./session.cjs";
import { MySqlSelectConfig } from "./query-builders/select.types.cjs";
import { entityKind } from "../entity.cjs";
import { QueryWithTypings, SQL } from "../sql/sql.cjs";
import { Casing, UpdateSet } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { MigrationConfig, MigrationMeta, MigratorInitFailResponse } from "../migrator.cjs";
import { BuildRelationalQueryResult, DBQueryConfig as DBQueryConfig$1, TableRelationalConfig as TableRelationalConfig$1, TablesRelationalConfig as TablesRelationalConfig$1 } from "../relations.cjs";

//#region src/mysql-core/dialect.d.ts
interface MySqlDialectConfig {
  casing?: Casing;
  escapeParam?: (num: number) => string;
}
declare class MySqlDialect {
  static readonly [entityKind]: string;
  constructor(config?: MySqlDialectConfig);
  migrate(migrations: MigrationMeta[], session: MySqlSession, config: Omit<MigrationConfig, 'migrationsSchema'>): Promise<void | MigratorInitFailResponse>;
  escapeName(name: string): string;
  escapeParam(_num: number): string;
  escapeString(str: string): string;
  private buildWithCTE;
  buildDeleteQuery({
    table,
    where,
    returning,
    withList,
    limit,
    orderBy
  }: MySqlDeleteConfig): SQL;
  buildUpdateSet(table: MySqlTable, set: UpdateSet): SQL;
  buildUpdateQuery({
    table,
    set,
    where,
    returning,
    withList,
    limit,
    orderBy
  }: MySqlUpdateConfig): SQL;
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
  private buildLimit;
  private buildOrderBy;
  private buildIndex;
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
    setOperators,
    useIndex,
    forceIndex,
    ignoreIndex
  }: MySqlSelectConfig): SQL;
  buildSetOperations(leftSelect: SQL, setOperators: MySqlSelectConfig['setOperators']): SQL;
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
    setOperator: MySqlSelectConfig['setOperators'][number];
  }): SQL;
  buildInsertQuery({
    table,
    values: valuesOrSelect,
    ignore,
    onConflict,
    select
  }: MySqlInsertConfig): {
    sql: SQL;
    generatedIds: Record<string, unknown>[];
  };
  sqlToQuery(sql: SQL, invokeSource?: 'indexes' | undefined): QueryWithTypings;
  /** @deprecated */
  _buildRelationalQuery({
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
    table: MySqlTable;
    tableConfig: V1.TableRelationalConfig;
    queryConfig: true | V1.DBQueryConfig<'many', true>;
    tableAlias: string;
    nestedQueryRelation?: V1.Relation;
    joinOn?: SQL;
  }): V1.BuildRelationalQueryResult<MySqlTable, MySqlColumn>;
  /** @deprecated */
  _buildRelationalQueryWithoutLateralSubqueries({
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
    table: MySqlTable;
    tableConfig: V1.TableRelationalConfig;
    queryConfig: true | V1.DBQueryConfig<'many', true>;
    tableAlias: string;
    nestedQueryRelation?: V1.Relation;
    joinOn?: SQL;
  }): V1.BuildRelationalQueryResult<MySqlTable, MySqlColumn>;
  private nestedSelectionerror;
  private buildRqbColumn;
  private unwrapAllColumns;
  private getSelectedTableColumns;
  private buildColumns;
  buildRelationalQuery({
    schema,
    table,
    tableConfig,
    queryConfig: config,
    relationWhere,
    mode,
    errorPath,
    depth,
    isNestedMany,
    throughJoin
  }: {
    schema: TablesRelationalConfig$1;
    table: MySqlTable | MySqlView;
    tableConfig: TableRelationalConfig$1;
    queryConfig?: DBQueryConfig$1<'many'> | true;
    relationWhere?: SQL;
    mode: 'first' | 'many';
    errorPath?: string;
    depth?: number;
    isNestedMany?: boolean;
    throughJoin?: SQL;
  }): BuildRelationalQueryResult;
}
//#endregion
export { MySqlDialect, MySqlDialectConfig };
//# sourceMappingURL=dialect.d.cts.map