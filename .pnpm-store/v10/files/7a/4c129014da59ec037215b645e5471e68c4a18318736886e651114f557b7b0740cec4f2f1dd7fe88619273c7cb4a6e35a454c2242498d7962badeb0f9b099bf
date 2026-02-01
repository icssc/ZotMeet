import { MySqlDateBaseColumn, MySqlDateColumnBaseBuilder } from "./date.common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mysql-core/columns/timestamp.d.ts
declare class MySqlTimestampBuilder extends MySqlDateColumnBaseBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | number;
}, MySqlTimestampConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlTimestampConfig | undefined);
}
declare class MySqlTimestamp<T extends ColumnBaseConfig<'object date'>> extends MySqlDateBaseColumn<T, MySqlTimestampConfig> {
  static readonly [entityKind]: string;
  readonly fsp: number | undefined;
  getSQLType(): string;
  mapFromDriverValue(value: Date | string): Date;
  mapToDriverValue(value: Date | string): string;
}
declare class MySqlTimestampStringBuilder extends MySqlDateColumnBaseBuilder<{
  dataType: 'string timestamp';
  data: string;
  driverParam: string | number;
}, MySqlTimestampConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlTimestampConfig | undefined);
}
declare class MySqlTimestampString<T extends ColumnBaseConfig<'string timestamp'>> extends MySqlDateBaseColumn<T, MySqlTimestampConfig> {
  static readonly [entityKind]: string;
  readonly fsp: number | undefined;
  getSQLType(): string;
  mapFromDriverValue(value: Date | string): string;
  mapToDriverValue(value: Date | string): string;
}
type TimestampFsp = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface MySqlTimestampConfig<TMode extends 'string' | 'date' = 'string' | 'date'> {
  mode?: TMode;
  fsp?: TimestampFsp;
}
declare function timestamp<TMode extends MySqlTimestampConfig['mode'] & {}>(config?: MySqlTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlTimestampStringBuilder : MySqlTimestampBuilder;
declare function timestamp<TMode extends MySqlTimestampConfig['mode'] & {}>(name: string, config?: MySqlTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlTimestampStringBuilder : MySqlTimestampBuilder;
//#endregion
export { MySqlTimestamp, MySqlTimestampBuilder, MySqlTimestampConfig, MySqlTimestampString, MySqlTimestampStringBuilder, TimestampFsp, timestamp };
//# sourceMappingURL=timestamp.d.cts.map