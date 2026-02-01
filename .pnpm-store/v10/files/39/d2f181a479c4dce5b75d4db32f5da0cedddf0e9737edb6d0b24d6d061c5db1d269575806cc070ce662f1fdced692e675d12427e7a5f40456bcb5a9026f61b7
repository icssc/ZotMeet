import { entityKind } from "../../entity.js";
import { Column, ColumnBaseConfig } from "../../column.js";
import { Update } from "../../utils.js";
import { ColumnBuilder, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnType, HasGenerated, NotNull } from "../../column-builder.js";
import { SQL } from "../../sql/index.js";
import { UpdateDeleteAction } from "../foreign-keys.js";
import { MsSqlTable } from "../table.js";

//#region src/mssql-core/columns/common.d.ts
type MsSqlColumns = Record<string, MsSqlColumn<any>>;
interface ReferenceConfig {
  ref: () => MsSqlColumn;
  actions: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  };
}
interface MsSqlGeneratedColumnConfig {
  mode?: 'virtual' | 'persisted';
}
declare abstract class MsSqlColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends ColumnBuilder<T, TRuntimeConfig, TExtraConfig> {
  static readonly [entityKind]: string;
  private foreignKeyConfigs;
  references(ref: ReferenceConfig['ref'], actions?: ReferenceConfig['actions']): this;
  unique(name?: string): this;
  generatedAlwaysAs(as: SQL | (() => SQL), config?: MsSqlGeneratedColumnConfig): HasGenerated<this, {
    type: 'always';
  }>;
}
declare abstract class MsSqlColumn<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = object> extends Column<T, TRuntimeConfig> {
  static readonly [entityKind]: string;
  constructor(table: MsSqlTable, config: ColumnBuilderRuntimeConfig<T['data']> & TRuntimeConfig);
}
type AnyMsSqlColumn<TPartial extends Partial<ColumnBaseConfig<ColumnType>> = {}> = MsSqlColumn<Required<Update<ColumnBaseConfig<ColumnType>, TPartial>>>;
interface MsSqlColumnWithIdentityConfig {
  identity: {
    seed?: number;
    increment?: number;
  } | undefined;
}
declare abstract class MsSqlColumnBuilderWithIdentity<T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends MsSqlColumnBuilder<T, TRuntimeConfig & MsSqlColumnWithIdentityConfig, TExtraConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, dataType: T['dataType'], columnType: string);
  identity(): NotNull<HasGenerated<this>>;
  identity(config: {
    seed: number;
    increment: number;
  }): NotNull<HasGenerated<this>>;
}
declare abstract class MsSqlColumnWithIdentity<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = object> extends MsSqlColumn<T, MsSqlColumnWithIdentityConfig & TRuntimeConfig> {
  static readonly [entityKind]: string;
  readonly identity: {
    seed?: number;
    increment?: number;
  } | undefined;
  shouldDisableInsert(): boolean;
}
//#endregion
export { AnyMsSqlColumn, MsSqlColumn, MsSqlColumnBuilder, MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity, MsSqlColumnWithIdentityConfig, MsSqlColumns, MsSqlGeneratedColumnConfig, ReferenceConfig };
//# sourceMappingURL=common.d.ts.map