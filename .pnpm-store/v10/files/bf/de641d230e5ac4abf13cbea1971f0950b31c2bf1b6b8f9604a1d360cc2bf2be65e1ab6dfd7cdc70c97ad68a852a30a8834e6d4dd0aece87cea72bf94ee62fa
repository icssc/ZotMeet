import { entityKind } from "../../entity.js";
import { Column, ColumnBaseConfig } from "../../column.js";
import { Update } from "../../utils.js";
import { SQL } from "../../sql/sql.js";
import { ColumnBuilder, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnType, HasGenerated } from "../../column-builder.js";
import { UpdateDeleteAction } from "../foreign-keys.js";
import { SQLiteTable } from "../table.js";

//#region src/sqlite-core/columns/common.d.ts
type SQLiteColumns = Record<string, SQLiteColumn<any>>;
interface ReferenceConfig {
  ref: () => SQLiteColumn;
  actions: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  };
}
interface SQLiteGeneratedColumnConfig {
  mode?: 'virtual' | 'stored';
}
declare abstract class SQLiteColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = object> extends ColumnBuilder<T, TRuntimeConfig, TExtraConfig> {
  static readonly [entityKind]: string;
  private foreignKeyConfigs;
  references(ref: ReferenceConfig['ref'], actions?: ReferenceConfig['actions']): this;
  unique(name?: string): this;
  generatedAlwaysAs(as: SQL | (() => SQL), config?: SQLiteGeneratedColumnConfig): HasGenerated<this, {
    type: 'always';
  }>;
}
declare abstract class SQLiteColumn<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = {}> extends Column<T, TRuntimeConfig> {
  static readonly [entityKind]: string;
  constructor(table: SQLiteTable, config: ColumnBuilderRuntimeConfig<T['data']> & TRuntimeConfig);
}
type AnySQLiteColumn<TPartial extends Partial<ColumnBaseConfig<ColumnType>> = {}> = SQLiteColumn<Required<Update<ColumnBaseConfig<ColumnType>, TPartial>>>;
//#endregion
export { AnySQLiteColumn, ReferenceConfig, SQLiteColumn, SQLiteColumnBuilder, SQLiteColumns, SQLiteGeneratedColumnConfig };
//# sourceMappingURL=common.d.ts.map