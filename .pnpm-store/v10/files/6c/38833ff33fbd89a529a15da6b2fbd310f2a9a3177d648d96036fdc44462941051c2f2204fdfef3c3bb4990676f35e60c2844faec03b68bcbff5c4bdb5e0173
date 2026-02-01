import { MySqlDateBaseColumn, MySqlDateColumnBaseBuilder } from "./date.common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";
import { AnyMySqlTable } from "../table.js";

//#region src/mysql-core/columns/datetime.d.ts
declare class MySqlDateTimeBuilder extends MySqlDateColumnBaseBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | number;
}, MySqlDatetimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlDatetimeConfig | undefined);
}
declare class MySqlDateTime<T extends ColumnBaseConfig<'object date'>> extends MySqlDateBaseColumn<T> {
  static readonly [entityKind]: string;
  readonly fsp: number | undefined;
  constructor(table: AnyMySqlTable<{
    name: T['tableName'];
  }>, config: MySqlDateTimeBuilder['config']);
  getSQLType(): string;
  mapToDriverValue(value: Date | string): string;
  mapFromDriverValue(value: string | Date): Date;
}
declare class MySqlDateTimeStringBuilder extends MySqlDateColumnBaseBuilder<{
  dataType: 'string datetime';
  data: string;
  driverParam: string | number;
}, MySqlDatetimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlDatetimeConfig | undefined);
}
declare class MySqlDateTimeString<T extends ColumnBaseConfig<'string datetime'>> extends MySqlDateBaseColumn<T> {
  static readonly [entityKind]: string;
  readonly fsp: number | undefined;
  constructor(table: AnyMySqlTable<{
    name: T['tableName'];
  }>, config: MySqlDateTimeStringBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: Date | string): string;
  mapToDriverValue(value: Date | string): string;
}
type DatetimeFsp = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface MySqlDatetimeConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
  mode?: TMode;
  fsp?: DatetimeFsp;
}
declare function datetime<TMode extends MySqlDatetimeConfig['mode'] & {}>(config?: MySqlDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlDateTimeStringBuilder : MySqlDateTimeBuilder;
declare function datetime<TMode extends MySqlDatetimeConfig['mode'] & {}>(name: string, config?: MySqlDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlDateTimeStringBuilder : MySqlDateTimeBuilder;
//#endregion
export { DatetimeFsp, MySqlDateTime, MySqlDateTimeBuilder, MySqlDateTimeString, MySqlDateTimeStringBuilder, MySqlDatetimeConfig, datetime };
//# sourceMappingURL=datetime.d.ts.map