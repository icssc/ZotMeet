import { PgMaterializedView, PgView } from "./view.cjs";
import { entityKind } from "../entity.cjs";
import { DriverValueEncoder, QueryTypingsValue, QueryWithTypings, SQL } from "../sql/sql.cjs";
import { Casing, UpdateSet } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { BuildRelationalQueryResult, DBQueryConfig as DBQueryConfig$1, TableRelationalConfig as TableRelationalConfig$1, TablesRelationalConfig as TablesRelationalConfig$1 } from "../relations.cjs";
import { PgColumn } from "./columns/index.cjs";
import { PgTable } from "./table.cjs";
import { PgDeleteConfig, PgInsertConfig, PgUpdateConfig } from "./query-builders/index.cjs";
import { PgSelectConfig } from "./query-builders/select.types.cjs";

//#region src/pg-core/dialect.d.ts
interface PgDialectConfig {
  casing?: Casing;
}
declare class PgDialect {
  static readonly [entityKind]: string;
  constructor(config?: PgDialectConfig);
  escapeName(name: string): string;
  escapeParam(num: number): string;
  escapeString(str: string): string;
  private buildWithCTE;
  buildDeleteQuery({
    table,
    where,
    returning,
    withList
  }: PgDeleteConfig): SQL;
  buildUpdateSet(table: PgTable, set: UpdateSet): SQL;
  buildUpdateQuery({
    table,
    set,
    where,
    returning,
    withList,
    from,
    joins
  }: PgUpdateConfig): SQL;
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
  }: PgSelectConfig): SQL;
  buildSetOperations(leftSelect: SQL, setOperators: PgSelectConfig['setOperators']): SQL;
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
    setOperator: PgSelectConfig['setOperators'][number];
  }): SQL;
  buildInsertQuery({
    table,
    values: valuesOrSelect,
    onConflict,
    returning,
    withList,
    select,
    overridingSystemValue_
  }: PgInsertConfig): SQL;
  buildRefreshMaterializedViewQuery({
    view,
    concurrently,
    withNoData
  }: {
    view: PgMaterializedView;
    concurrently?: boolean;
    withNoData?: boolean;
  }): SQL;
  prepareTyping(encoder: DriverValueEncoder<unknown, unknown>): QueryTypingsValue;
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
    table: PgTable;
    tableConfig: V1.TableRelationalConfig;
    queryConfig: true | V1.DBQueryConfig<'many', true>;
    tableAlias: string;
    nestedQueryRelation?: V1.Relation;
    joinOn?: SQL;
  }): V1.BuildRelationalQueryResult<PgTable, PgColumn>;
  private nestedSelectionerror;
  private buildRqbColumn;
  private unwrapAllColumns;
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
    throughJoin
  }: {
    schema: TablesRelationalConfig$1;
    table: PgTable | PgView;
    tableConfig: TableRelationalConfig$1;
    queryConfig?: DBQueryConfig$1<'many'> | true;
    relationWhere?: SQL;
    mode: 'first' | 'many';
    errorPath?: string;
    depth?: number;
    throughJoin?: SQL;
  }): BuildRelationalQueryResult;
}
//#endregion
export { PgDialect, PgDialectConfig };
//# sourceMappingURL=dialect.d.cts.map