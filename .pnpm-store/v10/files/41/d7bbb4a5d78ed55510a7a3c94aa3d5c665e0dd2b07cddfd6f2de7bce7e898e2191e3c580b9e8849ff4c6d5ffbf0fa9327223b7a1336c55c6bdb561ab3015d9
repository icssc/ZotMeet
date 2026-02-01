import { CockroachViewBase } from "./view-base.cjs";
import { QueryBuilder } from "./query-builders/query-builder.cjs";
import { entityKind } from "../entity.cjs";
import { TypedQueryBuilder } from "../query-builders/query-builder.cjs";
import { AddAliasToSelection } from "../query-builders/select.types.cjs";
import { ColumnsSelection, SQL } from "../sql/sql.cjs";
import { BuildColumns, ColumnBuilderBase } from "../column-builder.cjs";

//#region src/cockroach-core/view.d.ts
declare class DefaultViewBuilderCore<TConfig extends {
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
}
declare class ViewBuilder<TName extends string = string> extends DefaultViewBuilderCore<{
  name: TName;
}> {
  static readonly [entityKind]: string;
  as<TSelectedFields extends ColumnsSelection>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): CockroachViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'cockroach'>>;
}
declare class ManualViewBuilder<TName extends string = string, TColumns extends Record<string, ColumnBuilderBase> = Record<string, ColumnBuilderBase>> extends DefaultViewBuilderCore<{
  name: TName;
  columns: TColumns;
}> {
  static readonly [entityKind]: string;
  private columns;
  constructor(name: TName, columns: TColumns, schema: string | undefined);
  existing(): CockroachViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'cockroach'>>;
  as(query: SQL): CockroachViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'cockroach'>>;
}
declare class MaterializedViewBuilderCore<TConfig extends {
  name: string;
  columns?: unknown;
}> {
  protected name: TConfig['name'];
  protected schema: string | undefined;
  static readonly [entityKind]: string;
  _: {
    readonly name: TConfig['name'];
    readonly columns: TConfig['columns'];
  };
  constructor(name: TConfig['name'], schema: string | undefined);
  protected config: {
    withNoData?: boolean;
  };
  withNoData(): this;
}
declare class MaterializedViewBuilder<TName extends string = string> extends MaterializedViewBuilderCore<{
  name: TName;
}> {
  static readonly [entityKind]: string;
  as<TSelectedFields extends ColumnsSelection>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): CockroachMaterializedViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'cockroach'>>;
}
declare class ManualMaterializedViewBuilder<TName extends string = string, TColumns extends Record<string, ColumnBuilderBase> = Record<string, ColumnBuilderBase>> extends MaterializedViewBuilderCore<{
  name: TName;
  columns: TColumns;
}> {
  static readonly [entityKind]: string;
  private columns;
  constructor(name: TName, columns: TColumns, schema: string | undefined);
  existing(): CockroachMaterializedViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'cockroach'>>;
  as(query: SQL): CockroachMaterializedViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'cockroach'>>;
}
declare class CockroachView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends CockroachViewBase<TName, TExisting, TSelectedFields> {
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
type CockroachViewWithSelection<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> = CockroachView<TName, TExisting, TSelectedFields> & TSelectedFields;
declare const CockroachMaterializedViewConfig: unique symbol;
declare class CockroachMaterializedView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends CockroachViewBase<TName, TExisting, TSelectedFields> {
  static readonly [entityKind]: string;
  readonly [CockroachMaterializedViewConfig]: {
    readonly withNoData?: boolean;
  } | undefined;
  constructor({
    cockroachConfig,
    config
  }: {
    cockroachConfig: {
      withNoData: boolean | undefined;
    } | undefined;
    config: {
      name: TName;
      schema: string | undefined;
      selectedFields: ColumnsSelection;
      query: SQL | undefined;
    };
  });
}
type CockroachMaterializedViewWithSelection<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> = CockroachMaterializedView<TName, TExisting, TSelectedFields> & TSelectedFields;
declare function cockroachView<TName extends string>(name: TName): ViewBuilder<TName>;
declare function cockroachView<TName extends string, TColumns extends Record<string, ColumnBuilderBase>>(name: TName, columns: TColumns): ManualViewBuilder<TName, TColumns>;
declare function cockroachMaterializedView<TName extends string>(name: TName): MaterializedViewBuilder<TName>;
declare function cockroachMaterializedView<TName extends string, TColumns extends Record<string, ColumnBuilderBase>>(name: TName, columns: TColumns): ManualMaterializedViewBuilder<TName, TColumns>;
declare function isCockroachView(obj: unknown): obj is CockroachView;
declare function isCockroachMaterializedView(obj: unknown): obj is CockroachMaterializedView;
//#endregion
export { CockroachMaterializedView, CockroachMaterializedViewConfig, CockroachMaterializedViewWithSelection, CockroachView, CockroachViewWithSelection, DefaultViewBuilderCore, ManualMaterializedViewBuilder, ManualViewBuilder, MaterializedViewBuilder, MaterializedViewBuilderCore, ViewBuilder, cockroachMaterializedView, cockroachView, isCockroachMaterializedView, isCockroachView };
//# sourceMappingURL=view.d.cts.map