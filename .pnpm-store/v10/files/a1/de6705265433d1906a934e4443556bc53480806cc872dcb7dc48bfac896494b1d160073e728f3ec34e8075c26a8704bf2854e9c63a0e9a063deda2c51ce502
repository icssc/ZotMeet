import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { TimestampFsp } from "./timestamp.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnType, HasDefault } from "../../column-builder.js";

//#region src/mysql-core/columns/date.common.d.ts
interface MySqlDateColumnBaseConfig {
  hasOnUpdateNow: boolean;
  onUpdateNowFsp: TimestampFsp | undefined;
}
declare abstract class MySqlDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends MySqlColumnBuilder<T, TRuntimeConfig & MySqlDateColumnBaseConfig, TExtraConfig> {
  static readonly [entityKind]: string;
  defaultNow(): HasDefault<this>;
  onUpdateNow(config?: {
    fsp: TimestampFsp;
  }): HasDefault<this>;
}
declare abstract class MySqlDateBaseColumn<T extends ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = object> extends MySqlColumn<T, MySqlDateColumnBaseConfig & TRuntimeConfig> {
  static readonly [entityKind]: string;
  readonly hasOnUpdateNow: boolean;
  readonly onUpdateNowFsp: TimestampFsp | undefined;
}
//#endregion
export { MySqlDateBaseColumn, MySqlDateColumnBaseBuilder, MySqlDateColumnBaseConfig };
//# sourceMappingURL=date.common.d.ts.map