import { MsSqlViewBase } from "./view-base.cjs";
import { QueryBuilder } from "./query-builders/query-builder.cjs";
import { MsSqlViewConfig } from "./view-common.cjs";
import { SelectedFields } from "./query-builders/select.types.cjs";
import { entityKind } from "../entity.cjs";
import { TypedQueryBuilder } from "../query-builders/query-builder.cjs";
import { AddAliasToSelection } from "../query-builders/select.types.cjs";
import { ColumnsSelection, SQL } from "../sql/sql.cjs";
import { BuildColumns, ColumnBuilderBase } from "../column-builder.cjs";

//#region src/mssql-core/view.d.ts
interface ViewBuilderConfig {
  encryption?: boolean;
  schemaBinding?: boolean;
  viewMetadata?: boolean;
  checkOption?: boolean;
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
  with(config?: ViewBuilderConfig): this;
}
declare class ViewBuilder<TName extends string = string> extends ViewBuilderCore<{
  name: TName;
}> {
  static readonly [entityKind]: string;
  as<TSelectedFields extends SelectedFields>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): MsSqlViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'mssql'>>;
}
declare class ManualViewBuilder<TName extends string = string, TColumns extends Record<string, ColumnBuilderBase> = Record<string, ColumnBuilderBase>> extends ViewBuilderCore<{
  name: TName;
  columns: TColumns;
}> {
  static readonly [entityKind]: string;
  private columns;
  constructor(name: TName, columns: TColumns, schema: string | undefined);
  existing(): MsSqlViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'mssql'>>;
  as(query: SQL): MsSqlViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'mssql'>>;
}
declare class MsSqlView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends MsSqlViewBase<TName, TExisting, TSelectedFields> {
  static readonly [entityKind]: string;
  protected $MsSqlViewBrand: 'MsSqlView';
  [MsSqlViewConfig]: ViewBuilderConfig | undefined;
  constructor({
    mssqlConfig,
    config
  }: {
    mssqlConfig: ViewBuilderConfig | undefined;
    config: {
      name: TName;
      schema: string | undefined;
      selectedFields: SelectedFields;
      query: SQL | undefined;
    };
  });
}
type MsSqlViewWithSelection<TName extends string, TExisting extends boolean, TSelectedFields extends ColumnsSelection> = MsSqlView<TName, TExisting, TSelectedFields> & TSelectedFields;
declare function mssqlView<TName extends string>(name: TName): ViewBuilder<TName>;
declare function mssqlView<TName extends string, TColumns extends Record<string, ColumnBuilderBase>>(name: TName, columns: TColumns): ManualViewBuilder<TName, TColumns>;
//#endregion
export { ManualViewBuilder, MsSqlView, MsSqlViewWithSelection, ViewBuilder, ViewBuilderConfig, ViewBuilderCore, mssqlView };
//# sourceMappingURL=view.d.cts.map