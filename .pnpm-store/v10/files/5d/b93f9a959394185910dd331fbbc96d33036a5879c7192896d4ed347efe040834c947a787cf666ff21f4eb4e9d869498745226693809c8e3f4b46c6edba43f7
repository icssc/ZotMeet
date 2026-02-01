import { MsSqlColumn } from "./columns/common.js";
import { MsSqlDeleteConfig } from "./query-builders/delete.js";
import { MsSqlInsertConfig } from "./query-builders/insert.js";
import { MsSqlUpdateConfig } from "./query-builders/update.js";
import { MsSqlTable } from "./table.js";
import { MsSqlSession } from "./session.js";
import { MsSqlSelectConfig } from "./query-builders/select.types.js";
import { entityKind } from "../entity.js";
import { Casing, UpdateSet } from "../utils.js";
import { QueryWithTypings, SQL } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { MigrationConfig, MigrationMeta, MigratorInitFailResponse } from "../migrator.js";

//#region src/mssql-core/dialect.d.ts
interface MsSqlDialectConfig {
  casing?: Casing;
}
declare class MsSqlDialect {
  static readonly [entityKind]: string;
  constructor(config?: MsSqlDialectConfig);
  migrate(migrations: MigrationMeta[], session: MsSqlSession, config: MigrationConfig): Promise<void | MigratorInitFailResponse>;
  escapeName(name: string): string;
  escapeParam(_num: number): string;
  escapeString(str: string): string;
  buildDeleteQuery({
    table,
    where,
    output
  }: MsSqlDeleteConfig): SQL;
  buildUpdateSet(table: MsSqlTable, set: UpdateSet): SQL;
  buildUpdateQuery({
    table,
    set,
    where,
    output
  }: MsSqlUpdateConfig): SQL;
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
  private buildSelectionOutput;
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
    fetch,
    for: _for,
    top,
    offset,
    distinct,
    setOperators
  }: MsSqlSelectConfig): SQL;
  buildSetOperations(leftSelect: SQL, setOperators: MsSqlSelectConfig['setOperators']): SQL;
  buildSetOperationQuery({
    leftSelect,
    setOperator: {
      type,
      isAll,
      rightSelect,
      fetch,
      orderBy,
      offset
    }
  }: {
    leftSelect: SQL;
    setOperator: MsSqlSelectConfig['setOperators'][number];
  }): SQL;
  buildInsertQuery({
    table,
    values,
    output
  }: MsSqlInsertConfig): SQL;
  sqlToQuery(sql: SQL, invokeSource?: 'indexes' | 'mssql-check' | 'mssql-view-with-schemabinding'): QueryWithTypings;
  buildRelationalQuery({
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
    table: MsSqlTable;
    tableConfig: V1.TableRelationalConfig;
    queryConfig: true | V1.DBQueryConfig<'many', true>;
    tableAlias: string;
    nestedQueryRelation?: V1.Relation;
    joinOn?: SQL;
  }): V1.BuildRelationalQueryResult<MsSqlTable, MsSqlColumn>;
}
//#endregion
export { MsSqlDialect, MsSqlDialectConfig };
//# sourceMappingURL=dialect.d.ts.map