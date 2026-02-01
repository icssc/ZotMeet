import { entityKind } from "./entity.js";
import { Table } from "./table.js";
import { SQL, View } from "./sql/sql.js";
import { AnyColumn, Column } from "./column.js";
import { Relation } from "./_relations.js";

//#region src/alias.d.ts
declare class ColumnTableAliasProxyHandler<TColumn extends Column> implements ProxyHandler<TColumn> {
  private table;
  private ignoreColumnAlias?;
  static readonly [entityKind]: string;
  constructor(table: Table | View, ignoreColumnAlias?: boolean | undefined);
  get(columnObj: TColumn, prop: string | symbol): any;
}
declare class ViewSelectionAliasProxyHandler<TSelection extends Record<string, unknown>> implements ProxyHandler<TSelection> {
  protected view: View;
  protected selection: TSelection;
  private ignoreColumnAlias?;
  static readonly [entityKind]: string;
  constructor(view: View, selection: TSelection, ignoreColumnAlias?: boolean | undefined);
  get(selection: TSelection, prop: string | symbol): any;
}
declare class TableAliasProxyHandler<T extends Table | View> implements ProxyHandler<T> {
  private alias;
  private replaceOriginalName;
  private ignoreColumnAlias?;
  static readonly [entityKind]: string;
  constructor(alias: string, replaceOriginalName: boolean, ignoreColumnAlias?: boolean | undefined);
  get(target: T, prop: string | symbol): any;
}
declare class ColumnAliasProxyHandler<T extends Column> implements ProxyHandler<T> {
  private alias;
  static readonly [entityKind]: string;
  constructor(alias: string);
  get(target: T, prop: keyof Column): any;
}
declare class RelationTableAliasProxyHandler<T extends Relation> implements ProxyHandler<T> {
  private alias;
  static readonly [entityKind]: string;
  constructor(alias: string);
  get(target: T, prop: string | symbol): any;
}
declare function aliasedTable<T extends Table | View>(table: T, tableAlias: string): T;
declare function aliasedColumn<T extends Column>(column: T, alias: string): T;
declare function aliasedRelation<T extends Relation>(relation: T, tableAlias: string): T;
declare function aliasedTableColumn<T extends AnyColumn>(column: T, tableAlias: string): T;
declare function mapColumnsInAliasedSQLToAlias(query: SQL.Aliased, alias: string): SQL.Aliased;
declare function mapColumnsInSQLToAlias(query: SQL, alias: string): SQL;
declare function getOriginalColumnFromAlias<T extends Column>(column: T): T;
//#endregion
export { ColumnAliasProxyHandler, ColumnTableAliasProxyHandler, RelationTableAliasProxyHandler, TableAliasProxyHandler, ViewSelectionAliasProxyHandler, aliasedColumn, aliasedRelation, aliasedTable, aliasedTableColumn, getOriginalColumnFromAlias, mapColumnsInAliasedSQLToAlias, mapColumnsInSQLToAlias };
//# sourceMappingURL=alias.d.ts.map