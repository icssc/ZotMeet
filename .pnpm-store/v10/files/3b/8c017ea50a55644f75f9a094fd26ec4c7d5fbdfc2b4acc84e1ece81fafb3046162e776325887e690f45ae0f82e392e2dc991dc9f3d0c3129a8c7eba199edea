import { MsSqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import * as __column_builder_ts0 from "../../column-builder.js";
import { ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnType } from "../../column-builder.js";

//#region src/mssql-core/columns/date.common.d.ts
declare abstract class MsSqlDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends MsSqlColumnBuilder<T, TRuntimeConfig, TExtraConfig> {
  static readonly [entityKind]: string;
  defaultGetDate(): __column_builder_ts0.HasDefault<this>;
}
type DatetimePrecision = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
interface MsSqlDatetimeConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
  mode?: TMode;
  precision?: DatetimePrecision;
}
//#endregion
export { DatetimePrecision, MsSqlDateColumnBaseBuilder, MsSqlDatetimeConfig };
//# sourceMappingURL=date.common.d.ts.map