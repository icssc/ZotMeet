import { SingleStoreColumn } from "./columns/common.js";
import { SingleStoreDeleteConfig } from "./query-builders/delete.js";
import { SingleStoreUpdateConfig } from "./query-builders/update.js";
import { SingleStoreInsertConfig } from "./query-builders/insert.js";
import { SingleStoreTable } from "./table.js";
import { SingleStoreView } from "./view.js";
import { SingleStoreSession } from "./session.js";
import { SingleStoreSelectConfig } from "./query-builders/select.types.js";
import { entityKind } from "../entity.js";
import { Casing, UpdateSet } from "../utils.js";
import { QueryWithTypings, SQL } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { MigrationConfig, MigrationMeta, MigratorInitFailResponse } from "../migrator.js";
import { BuildRelationalQueryResult, DBQueryConfig as DBQueryConfig$1, TableRelationalConfig as TableRelationalConfig$1, TablesRelationalConfig as TablesRelationalConfig$1 } from "../relations.js";

//#region src/singlestore-core/dialect.d.ts
interface SingleStoreDialectConfig {
  casing?: Casing;
}
interface BuildRelationalQueryResultWithOrder extends BuildRelationalQueryResult {
  order?: SQL;
}
declare class SingleStoreDialect {
  static readonly [entityKind]: string;
  constructor(config?: SingleStoreDialectConfig);
  migrate(migrations: MigrationMeta[], session: SingleStoreSession, config: Omit<MigrationConfig, 'migrationsSchema'>): Promise<void | MigratorInitFailResponse>;
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
  }: SingleStoreDeleteConfig): SQL;
  buildUpdateSet(table: SingleStoreTable, set: UpdateSet): SQL;
  buildUpdateQuery({
    table,
    set,
    where,
    returning,
    withList,
    limit,
    orderBy
  }: SingleStoreUpdateConfig): SQL;
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
  }: SingleStoreSelectConfig): SQL;
  buildSetOperations(leftSelect: SQL, setOperators: SingleStoreSelectConfig['setOperators']): SQL;
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
    setOperator: SingleStoreSelectConfig['setOperators'][number];
  }): SQL;
  buildInsertQuery({
    table,
    values,
    ignore,
    onConflict
  }: SingleStoreInsertConfig): {
    sql: SQL;
    generatedIds: Record<string, unknown>[];
  };
  sqlToQuery(sql: SQL, invokeSource?: 'indexes' | undefined): QueryWithTypings;
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
    table: SingleStoreTable;
    tableConfig: V1.TableRelationalConfig;
    queryConfig: true | V1.DBQueryConfig<'many', true>;
    tableAlias: string;
    nestedQueryRelation?: V1.Relation;
    joinOn?: SQL;
  }): V1.BuildRelationalQueryResult<SingleStoreTable, SingleStoreColumn>;
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
    table: SingleStoreTable | SingleStoreView;
    tableConfig: TableRelationalConfig$1;
    queryConfig?: DBQueryConfig$1<'many'> | true;
    relationWhere?: SQL;
    mode: 'first' | 'many';
    errorPath?: string;
    depth?: number;
    isNestedMany?: boolean;
    throughJoin?: SQL;
  }): BuildRelationalQueryResultWithOrder;
}
//#endregion
export { SingleStoreDialect, SingleStoreDialectConfig };
//# sourceMappingURL=dialect.d.ts.map