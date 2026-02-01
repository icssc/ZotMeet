import { entityKind } from "../../entity.js";
import { Column, ColumnBaseConfig } from "../../column.js";
import { Update } from "../../utils.js";
import { SQL } from "../../sql/sql.js";
import { ColumnBuilder, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnType, HasDefault, HasGenerated, IsAutoincrement } from "../../column-builder.js";
import { SingleStoreTable } from "../table.js";

//#region src/singlestore-core/columns/common.d.ts
type SingleStoreColumns = Record<string, SingleStoreColumn<any>>;
interface SingleStoreGeneratedColumnConfig {
  mode?: 'virtual' | 'stored';
}
declare abstract class SingleStoreColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType> & {
  data: any;
}, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends ColumnBuilder<T, TRuntimeConfig, TExtraConfig> {
  static readonly [entityKind]: string;
  unique(name?: string): this;
  generatedAlwaysAs(as: SQL | (() => SQL), config?: SingleStoreGeneratedColumnConfig): HasGenerated<this, {
    type: 'always';
  }>;
}
declare abstract class SingleStoreColumn<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = {}> extends Column<T, TRuntimeConfig> {
  static readonly [entityKind]: string;
  constructor(table: SingleStoreTable, config: ColumnBuilderRuntimeConfig<T['data']> & TRuntimeConfig);
}
type AnySingleStoreColumn<TPartial extends Partial<ColumnBaseConfig<ColumnType>> = {}> = SingleStoreColumn<Required<Update<ColumnBaseConfig<ColumnType>, TPartial>>>;
interface SingleStoreColumnWithAutoIncrementConfig {
  autoIncrement: boolean;
}
declare abstract class SingleStoreColumnBuilderWithAutoIncrement<T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends SingleStoreColumnBuilder<T, TRuntimeConfig & SingleStoreColumnWithAutoIncrementConfig, TExtraConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, dataType: T['dataType'], columnType: string);
  autoincrement(): IsAutoincrement<HasDefault<this>>;
}
declare abstract class SingleStoreColumnWithAutoIncrement<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = object> extends SingleStoreColumn<T, SingleStoreColumnWithAutoIncrementConfig & TRuntimeConfig> {
  static readonly [entityKind]: string;
  readonly autoIncrement: boolean;
}
//#endregion
export { AnySingleStoreColumn, SingleStoreColumn, SingleStoreColumnBuilder, SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement, SingleStoreColumnWithAutoIncrementConfig, SingleStoreColumns, SingleStoreGeneratedColumnConfig };
//# sourceMappingURL=common.d.ts.map