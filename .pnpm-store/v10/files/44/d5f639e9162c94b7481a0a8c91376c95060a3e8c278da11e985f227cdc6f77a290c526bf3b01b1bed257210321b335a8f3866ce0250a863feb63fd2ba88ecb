import { QueryBuilder } from "./query-builders/query-builder.js";
import { GelViewBase } from "./view-base.js";
import { GelMaterializedViewConfig, GelViewConfig } from "./view-common.js";
import { entityKind } from "../entity.js";
import { RequireAtLeastOne } from "../utils.js";
import { ColumnsSelection, SQL } from "../sql/sql.js";
import { BuildColumns, ColumnBuilderBase } from "../column-builder.js";
import { TypedQueryBuilder } from "../query-builders/query-builder.js";
import { AddAliasToSelection } from "../query-builders/select.types.js";

//#region src/gel-core/view.d.ts
type ViewWithConfig = RequireAtLeastOne<{
  checkOption: 'local' | 'cascaded';
  securityBarrier: boolean;
  securityInvoker: boolean;
}>;
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
  protected config: {
    with?: ViewWithConfig;
  };
  with(config: ViewWithConfig): this;
}
declare class ViewBuilder<TName extends string = string> extends DefaultViewBuilderCore<{
  name: TName;
}> {
  static readonly [entityKind]: string;
  as<TSelectedFields extends ColumnsSelection>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): GelViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'gel'>>;
}
declare class ManualViewBuilder<TName extends string = string, TColumns extends Record<string, ColumnBuilderBase> = Record<string, ColumnBuilderBase>> extends DefaultViewBuilderCore<{
  name: TName;
  columns: TColumns;
}> {
  static readonly [entityKind]: string;
  private columns;
  constructor(name: TName, columns: TColumns, schema: string | undefined);
  existing(): GelViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'gel'>>;
  as(query: SQL): GelViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'gel'>>;
}
type GelMaterializedViewWithConfig = RequireAtLeastOne<{
  fillfactor: number;
  toastTupleTarget: number;
  parallelWorkers: number;
  autovacuumEnabled: boolean;
  vacuumIndexCleanup: 'auto' | 'off' | 'on';
  vacuumTruncate: boolean;
  autovacuumVacuumThreshold: number;
  autovacuumVacuumScaleFactor: number;
  autovacuumVacuumCostDelay: number;
  autovacuumVacuumCostLimit: number;
  autovacuumFreezeMinAge: number;
  autovacuumFreezeMaxAge: number;
  autovacuumFreezeTableAge: number;
  autovacuumMultixactFreezeMinAge: number;
  autovacuumMultixactFreezeMaxAge: number;
  autovacuumMultixactFreezeTableAge: number;
  logAutovacuumMinDuration: number;
  userCatalogTable: boolean;
}>;
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
    with?: GelMaterializedViewWithConfig;
    using?: string;
    tablespace?: string;
    withNoData?: boolean;
  };
  using(using: string): this;
  with(config: GelMaterializedViewWithConfig): this;
  tablespace(tablespace: string): this;
  withNoData(): this;
}
declare class MaterializedViewBuilder<TName extends string = string> extends MaterializedViewBuilderCore<{
  name: TName;
}> {
  static readonly [entityKind]: string;
  as<TSelectedFields extends ColumnsSelection>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): GelMaterializedViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'gel'>>;
}
declare class ManualMaterializedViewBuilder<TName extends string = string, TColumns extends Record<string, ColumnBuilderBase> = Record<string, ColumnBuilderBase>> extends MaterializedViewBuilderCore<{
  name: TName;
  columns: TColumns;
}> {
  static readonly [entityKind]: string;
  private columns;
  constructor(name: TName, columns: TColumns, schema: string | undefined);
  existing(): GelMaterializedViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'gel'>>;
  as(query: SQL): GelMaterializedViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'gel'>>;
}
declare class GelView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends GelViewBase<TName, TExisting, TSelectedFields> {
  static readonly [entityKind]: string;
  [GelViewConfig]: {
    with?: ViewWithConfig;
  } | undefined;
  constructor({
    GelConfig,
    config
  }: {
    GelConfig: {
      with?: ViewWithConfig;
    } | undefined;
    config: {
      name: TName;
      schema: string | undefined;
      selectedFields: ColumnsSelection;
      query: SQL | undefined;
    };
  });
}
type GelViewWithSelection<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> = GelView<TName, TExisting, TSelectedFields> & TSelectedFields;
declare class GelMaterializedView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends GelViewBase<TName, TExisting, TSelectedFields> {
  static readonly [entityKind]: string;
  readonly [GelMaterializedViewConfig]: {
    readonly with?: GelMaterializedViewWithConfig;
    readonly using?: string;
    readonly tablespace?: string;
    readonly withNoData?: boolean;
  } | undefined;
  constructor({
    GelConfig,
    config
  }: {
    GelConfig: {
      with: GelMaterializedViewWithConfig | undefined;
      using: string | undefined;
      tablespace: string | undefined;
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
type GelMaterializedViewWithSelection<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> = GelMaterializedView<TName, TExisting, TSelectedFields> & TSelectedFields;
//#endregion
export { DefaultViewBuilderCore, GelMaterializedView, GelMaterializedViewWithConfig, GelMaterializedViewWithSelection, GelView, GelViewWithSelection, ManualMaterializedViewBuilder, ManualViewBuilder, MaterializedViewBuilder, MaterializedViewBuilderCore, ViewBuilder, ViewWithConfig };
//# sourceMappingURL=view.d.ts.map