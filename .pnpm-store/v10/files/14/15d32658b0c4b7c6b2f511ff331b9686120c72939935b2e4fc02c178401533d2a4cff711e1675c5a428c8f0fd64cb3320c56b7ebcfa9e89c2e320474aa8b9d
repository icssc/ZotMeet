import { SingleStoreDateBaseColumn, SingleStoreDateColumnBaseBuilder } from "./date.common.js";
import { HasDefault } from "../../column-builder.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";

//#region src/singlestore-core/columns/timestamp.d.ts
declare class SingleStoreTimestampBuilder extends SingleStoreDateColumnBaseBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | number;
}, SingleStoreTimestampConfig> {
  static readonly [entityKind]: string;
  constructor(name: string);
  defaultNow(): HasDefault<this>;
}
declare class SingleStoreTimestamp<T extends ColumnBaseConfig<'object date'>> extends SingleStoreDateBaseColumn<T, SingleStoreTimestampConfig> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string): Date;
  mapToDriverValue(value: Date | string): string;
}
declare class SingleStoreTimestampStringBuilder extends SingleStoreDateColumnBaseBuilder<{
  dataType: 'string timestamp';
  data: string;
  driverParam: string | number;
}, SingleStoreTimestampConfig> {
  static readonly [entityKind]: string;
  constructor(name: string);
  defaultNow(): HasDefault<this>;
}
declare class SingleStoreTimestampString<T extends ColumnBaseConfig<'string timestamp'>> extends SingleStoreDateBaseColumn<T, SingleStoreTimestampConfig> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapToDriverValue(value: Date | string): string;
}
interface SingleStoreTimestampConfig<TMode extends 'string' | 'date' = 'string' | 'date'> {
  mode?: TMode;
}
declare function timestamp<TMode extends SingleStoreTimestampConfig['mode'] & {}>(config?: SingleStoreTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreTimestampStringBuilder : SingleStoreTimestampBuilder;
declare function timestamp<TMode extends SingleStoreTimestampConfig['mode'] & {}>(name: string, config?: SingleStoreTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreTimestampStringBuilder : SingleStoreTimestampBuilder;
//#endregion
export { SingleStoreTimestamp, SingleStoreTimestampBuilder, SingleStoreTimestampConfig, SingleStoreTimestampString, SingleStoreTimestampStringBuilder, timestamp };
//# sourceMappingURL=timestamp.d.ts.map