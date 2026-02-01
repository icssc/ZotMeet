import { entityKind } from "../../entity.cjs";
import { SQL } from "../../sql/sql.cjs";
import { Update } from "../../utils.cjs";
import { Column, ColumnBaseConfig } from "../../column.cjs";
import { ColumnBuilder, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnType, HasDefault, HasGenerated, IsAutoincrement } from "../../column-builder.cjs";
import { MySqlTable } from "../table.cjs";
import { UpdateDeleteAction } from "../foreign-keys.cjs";

//#region src/mysql-core/columns/common.d.ts
type MySqlColumns = Record<string, MySqlColumn<any>>;
interface ReferenceConfig {
  ref: () => MySqlColumn;
  actions: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  };
}
interface MySqlGeneratedColumnConfig {
  mode?: 'virtual' | 'stored';
}
declare abstract class MySqlColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType> & {
  data: any;
}, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends ColumnBuilder<T, TRuntimeConfig, TExtraConfig> {
  static readonly [entityKind]: string;
  private foreignKeyConfigs;
  references(ref: ReferenceConfig['ref'], actions?: ReferenceConfig['actions']): this;
  unique(name?: string): this;
  generatedAlwaysAs(as: SQL | (() => SQL), config?: MySqlGeneratedColumnConfig): HasGenerated<this, {
    type: 'always';
  }>;
}
declare abstract class MySqlColumn<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = {}> extends Column<T, TRuntimeConfig> {
  static readonly [entityKind]: string;
  constructor(table: MySqlTable, config: ColumnBuilderRuntimeConfig<T['data']> & TRuntimeConfig);
}
type AnyMySqlColumn<TPartial extends Partial<ColumnBaseConfig<ColumnType>> = {}> = MySqlColumn<Required<Update<ColumnBaseConfig<ColumnType>, TPartial>>>;
interface MySqlColumnWithAutoIncrementConfig {
  autoIncrement: boolean;
}
declare abstract class MySqlColumnBuilderWithAutoIncrement<T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends MySqlColumnBuilder<T, TRuntimeConfig & MySqlColumnWithAutoIncrementConfig, TExtraConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, dataType: T['dataType'], columnType: string);
  autoincrement(): IsAutoincrement<HasDefault<this>>;
}
declare abstract class MySqlColumnWithAutoIncrement<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = object> extends MySqlColumn<T, MySqlColumnWithAutoIncrementConfig & TRuntimeConfig> {
  static readonly [entityKind]: string;
  readonly autoIncrement: boolean;
}
//#endregion
export { AnyMySqlColumn, MySqlColumn, MySqlColumnBuilder, MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement, MySqlColumnWithAutoIncrementConfig, MySqlColumns, MySqlGeneratedColumnConfig, ReferenceConfig };
//# sourceMappingURL=common.d.cts.map