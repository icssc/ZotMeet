import { MySqlViewBase } from "./view-base.cjs";
import { QueryBuilder } from "./query-builders/query-builder.cjs";
import { MySqlViewConfig } from "./view-common.cjs";
import { entityKind } from "../entity.cjs";
import { TypedQueryBuilder } from "../query-builders/query-builder.cjs";
import { AddAliasToSelection } from "../query-builders/select.types.cjs";
import { ColumnsSelection, SQL } from "../sql/sql.cjs";
import { BuildColumns, ColumnBuilderBase } from "../column-builder.cjs";

//#region src/mysql-core/view.d.ts
interface ViewBuilderConfig {
  algorithm?: 'undefined' | 'merge' | 'temptable';
  sqlSecurity?: 'definer' | 'invoker';
  withCheckOption?: 'cascaded' | 'local';
}
declare class ViewBuilderCore<TConfig extends {
  name: string;
  columns?: unknown;
}> {
  protected name: TConfig['name'];
  protected schema: string | undefined;
  static readonly [entityKind]: string;
  readonly _: {
    readonly name: TConfig['name'];
    readonly columns: TConfig['columns'];
  };
  constructor(name: TConfig['name'], schema: string | undefined);
  protected config: ViewBuilderConfig;
  algorithm(algorithm: Exclude<ViewBuilderConfig['algorithm'], undefined>): this;
  sqlSecurity(sqlSecurity: Exclude<ViewBuilderConfig['sqlSecurity'], undefined>): this;
  withCheckOption(withCheckOption?: Exclude<ViewBuilderConfig['withCheckOption'], undefined>): this;
}
declare class ViewBuilder<TName extends string = string> extends ViewBuilderCore<{
  name: TName;
}> {
  static readonly [entityKind]: string;
  as<TSelectedFields extends ColumnsSelection>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): MySqlViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'mysql'>>;
}
declare class ManualViewBuilder<TName extends string = string, TColumns extends Record<string, ColumnBuilderBase> = Record<string, ColumnBuilderBase>> extends ViewBuilderCore<{
  name: TName;
  columns: TColumns;
}> {
  static readonly [entityKind]: string;
  private columns;
  constructor(name: TName, columns: TColumns, schema: string | undefined);
  existing(): MySqlViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'mysql'>>;
  as(query: SQL): MySqlViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'mysql'>>;
}
declare class MySqlView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends MySqlViewBase<TName, TExisting, TSelectedFields> {
  static readonly [entityKind]: string;
  protected $MySqlViewBrand: 'MySqlView';
  [MySqlViewConfig]: ViewBuilderConfig | undefined;
  constructor({
    mysqlConfig,
    config
  }: {
    mysqlConfig: ViewBuilderConfig | undefined;
    config: {
      name: TName;
      schema: string | undefined;
      selectedFields: ColumnsSelection;
      query: SQL | undefined;
    };
  });
}
type MySqlViewWithSelection<TName extends string, TExisting extends boolean, TSelectedFields extends ColumnsSelection> = MySqlView<TName, TExisting, TSelectedFields> & TSelectedFields;
declare function mysqlView<TName extends string>(name: TName): ViewBuilder<TName>;
declare function mysqlView<TName extends string, TColumns extends Record<string, ColumnBuilderBase>>(name: TName, columns: TColumns): ManualViewBuilder<TName, TColumns>;
//#endregion
export { ManualViewBuilder, MySqlView, MySqlViewWithSelection, ViewBuilder, ViewBuilderConfig, ViewBuilderCore, mysqlView };
//# sourceMappingURL=view.d.cts.map