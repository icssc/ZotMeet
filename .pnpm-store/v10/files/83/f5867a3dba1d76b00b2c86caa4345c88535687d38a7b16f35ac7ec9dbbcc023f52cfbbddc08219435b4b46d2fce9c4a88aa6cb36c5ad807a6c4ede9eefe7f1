import { QueryBuilder } from "./query-builders/query-builder.js";
import { SingleStoreViewBase } from "./view-base.js";
import { SingleStoreViewConfig } from "./view-common.js";
import { SelectedFields } from "./query-builders/select.types.js";
import { entityKind } from "../entity.js";
import { ColumnsSelection, SQL } from "../sql/sql.js";
import { BuildColumns, ColumnBuilderBase } from "../column-builder.js";
import { TypedQueryBuilder } from "../query-builders/query-builder.js";
import { AddAliasToSelection } from "../query-builders/select.types.js";

//#region src/singlestore-core/view.d.ts
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
  protected schema: string | undefined;
  static readonly [entityKind]: string;
  readonly _: {
    readonly name: TConfig['name'];
    readonly columns: TConfig['columns'];
  };
  constructor(name: TConfig['name'], schema: string | undefined);
  protected config: ViewBuilderConfig;
  algorithm(algorithm: Exclude<ViewBuilderConfig['algorithm'], undefined>): this;
  definer(definer: Exclude<ViewBuilderConfig['definer'], undefined>): this;
  sqlSecurity(sqlSecurity: Exclude<ViewBuilderConfig['sqlSecurity'], undefined>): this;
  withCheckOption(withCheckOption?: Exclude<ViewBuilderConfig['withCheckOption'], undefined>): this;
}
declare class ViewBuilder<TName extends string = string> extends ViewBuilderCore<{
  name: TName;
}> {
  static readonly [entityKind]: string;
  as<TSelectedFields extends SelectedFields>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): SingleStoreViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'singlestore'>>;
}
declare class ManualViewBuilder<TName extends string = string, TColumns extends Record<string, ColumnBuilderBase> = Record<string, ColumnBuilderBase>> extends ViewBuilderCore<{
  name: TName;
  columns: TColumns;
}> {
  static readonly [entityKind]: string;
  private columns;
  constructor(name: TName, columns: TColumns, schema: string | undefined);
  existing(): SingleStoreViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'singlestore'>>;
  as(query: SQL): SingleStoreViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'singlestore'>>;
}
declare class SingleStoreView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends SingleStoreViewBase<TName, TExisting, TSelectedFields> {
  static readonly [entityKind]: string;
  protected $SingleStoreViewBrand: 'SingleStoreView';
  [SingleStoreViewConfig]: ViewBuilderConfig | undefined;
  constructor({
    singlestoreConfig,
    config
  }: {
    singlestoreConfig: ViewBuilderConfig | undefined;
    config: {
      name: TName;
      schema: string | undefined;
      selectedFields: SelectedFields;
      query: SQL | undefined;
    };
  });
}
type SingleStoreViewWithSelection<TName extends string, TExisting extends boolean, TSelectedFields extends ColumnsSelection> = SingleStoreView<TName, TExisting, TSelectedFields> & TSelectedFields;
//#endregion
export { ManualViewBuilder, SingleStoreView, SingleStoreViewWithSelection, ViewBuilder, ViewBuilderConfig, ViewBuilderCore };
//# sourceMappingURL=view.d.ts.map