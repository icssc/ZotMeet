import { SQLiteViewBase } from "./view-base.js";
import { QueryBuilder } from "./query-builders/query-builder.js";
import { entityKind } from "../entity.js";
import { ColumnsSelection, SQL } from "../sql/sql.js";
import { BuildColumns, ColumnBuilderBase } from "../column-builder.js";
import { TypedQueryBuilder } from "../query-builders/query-builder.js";
import { AddAliasToSelection } from "../query-builders/select.types.js";

//#region src/sqlite-core/view.d.ts
interface ViewBuilderConfig {
  algorithm?: 'undefined' | 'merge' | 'temptable';
  definer?: string;
  sqlSecurity?: 'definer' | 'invoker';
  withCheckOption?: 'cascaded' | 'local';
}
declare class ViewBuilderCore<TConfig extends {
  name: string;
  columns?: unknown;
}> {
  protected name: TConfig['name'];
  static readonly [entityKind]: string;
  readonly _: {
    readonly name: TConfig['name'];
    readonly columns: TConfig['columns'];
  };
  constructor(name: TConfig['name']);
  protected config: ViewBuilderConfig;
}
declare class ViewBuilder<TName extends string = string> extends ViewBuilderCore<{
  name: TName;
}> {
  static readonly [entityKind]: string;
  as<TSelection extends ColumnsSelection>(qb: TypedQueryBuilder<TSelection> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelection>)): SQLiteViewWithSelection<TName, false, AddAliasToSelection<TSelection, TName, 'sqlite'>>;
}
declare class ManualViewBuilder<TName extends string = string, TColumns extends Record<string, ColumnBuilderBase> = Record<string, ColumnBuilderBase>> extends ViewBuilderCore<{
  name: TName;
  columns: TColumns;
}> {
  static readonly [entityKind]: string;
  private columns;
  constructor(name: TName, columns: TColumns);
  existing(): SQLiteViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'sqlite'>>;
  as(query: SQL): SQLiteViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'sqlite'>>;
}
declare class SQLiteView<TName extends string = string, TExisting extends boolean = boolean, TSelection extends ColumnsSelection = ColumnsSelection> extends SQLiteViewBase<TName, TExisting, TSelection> {
  static readonly [entityKind]: string;
  constructor({
    config
  }: {
    config: {
      name: TName;
      schema: string | undefined;
      selectedFields: ColumnsSelection;
      query: SQL | undefined;
    };
  });
}
type SQLiteViewWithSelection<TName extends string, TExisting extends boolean, TSelection extends ColumnsSelection> = SQLiteView<TName, TExisting, TSelection> & TSelection;
declare function sqliteView<TName extends string>(name: TName): ViewBuilder<TName>;
declare function sqliteView<TName extends string, TColumns extends Record<string, ColumnBuilderBase>>(name: TName, columns: TColumns): ManualViewBuilder<TName, TColumns>;
declare const view: typeof sqliteView;
//#endregion
export { ManualViewBuilder, SQLiteView, SQLiteViewWithSelection, ViewBuilder, ViewBuilderConfig, ViewBuilderCore, sqliteView, view };
//# sourceMappingURL=view.d.ts.map