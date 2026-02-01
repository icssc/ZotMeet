import { GelMaterializedView, GelView } from "./view.js";
import { entityKind } from "../entity.js";
import { Casing, UpdateSet } from "../utils.js";
import { DriverValueEncoder, QueryTypingsValue, QueryWithTypings, SQL } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { BuildRelationalQueryResult, DBQueryConfig as DBQueryConfig$1, TableRelationalConfig as TableRelationalConfig$1, TablesRelationalConfig as TablesRelationalConfig$1 } from "../relations.js";
import { GelDeleteConfig, GelInsertConfig, GelUpdateConfig } from "./query-builders/index.js";
import { GelColumn } from "./columns/index.js";
import { GelTable } from "./table.js";
import { GelSelectConfig } from "./query-builders/select.types.js";

//#region src/gel-core/dialect.d.ts
interface GelDialectConfig {
  casing?: Casing;
}
declare class GelDialect {
  static readonly [entityKind]: string;
  constructor(config?: GelDialectConfig);
  escapeName(name: string): string;
  escapeParam(num: number): string;
  escapeString(str: string): string;
  private buildWithCTE;
  buildDeleteQuery({
    table,
    where,
    returning,
    withList
  }: GelDeleteConfig): SQL;
  buildUpdateSet(table: GelTable, set: UpdateSet): SQL;
  buildUpdateQuery({
    table,
    set,
    where,
    returning,
    withList,
    from,
    joins
  }: GelUpdateConfig): SQL;
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
   * ^ Temporarily disabled behaviour, see comments within method for a reasoning
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
  }: GelSelectConfig): SQL;
  buildSetOperations(leftSelect: SQL, setOperators: GelSelectConfig['setOperators']): SQL;
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
    setOperator: GelSelectConfig['setOperators'][number];
  }): SQL;
  buildInsertQuery({
    table,
    values: valuesOrSelect,
    onConflict,
    returning,
    withList,
    select,
    overridingSystemValue_
  }: GelInsertConfig): SQL;
  buildRefreshMaterializedViewQuery({
    view,
    concurrently,
    withNoData
  }: {
    view: GelMaterializedView;
    concurrently?: boolean;
    withNoData?: boolean;
  }): SQL;
  prepareTyping(encoder: DriverValueEncoder<unknown, unknown>): QueryTypingsValue;
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
    table: GelTable;
    tableConfig: V1.TableRelationalConfig;
    queryConfig: true | V1.DBQueryConfig<'many', true>;
    tableAlias: string;
    nestedQueryRelation?: V1.Relation;
    joinOn?: SQL;
  }): V1.BuildRelationalQueryResult<GelTable, GelColumn>;
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
    table: GelTable | GelView;
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
export { GelDialect, GelDialectConfig };
//# sourceMappingURL=dialect.d.ts.map