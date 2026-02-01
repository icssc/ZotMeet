import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnType, HasDefault } from "../../column-builder.js";

//#region src/singlestore-core/columns/date.common.d.ts
interface SingleStoreDateColumnBaseConfig {
  hasOnUpdateNow: boolean;
}
declare abstract class SingleStoreDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends SingleStoreColumnBuilder<T, TRuntimeConfig & SingleStoreDateColumnBaseConfig, TExtraConfig> {
  static readonly [entityKind]: string;
  defaultNow(): HasDefault<this>;
  onUpdateNow(): HasDefault<this>;
}
declare abstract class SingleStoreDateBaseColumn<T extends ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = object> extends SingleStoreColumn<T, SingleStoreDateColumnBaseConfig & TRuntimeConfig> {
  static readonly [entityKind]: string;
  readonly hasOnUpdateNow: boolean;
}
//#endregion
export { SingleStoreDateBaseColumn, SingleStoreDateColumnBaseBuilder, SingleStoreDateColumnBaseConfig };
//# sourceMappingURL=date.common.d.ts.map