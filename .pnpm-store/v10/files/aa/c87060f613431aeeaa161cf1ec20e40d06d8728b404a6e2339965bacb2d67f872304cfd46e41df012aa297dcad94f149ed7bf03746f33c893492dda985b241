import { MsSqlColumn } from "./common.js";
import { MsSqlDateColumnBaseBuilder } from "./date.common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";
import { MsSqlTable } from "../table.js";

//#region src/mssql-core/columns/datetime.d.ts
declare class MsSqlDateTimeBuilder extends MsSqlDateColumnBaseBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | Date;
}, MsSqlDatetimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MsSqlDateTime<T extends ColumnBaseConfig<'object date'>> extends MsSqlColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: MsSqlTable<any>, config: MsSqlDateTimeBuilder['config']);
  getSQLType(): string;
}
declare class MsSqlDateTimeStringBuilder extends MsSqlDateColumnBaseBuilder<{
  dataType: 'string datetime';
  data: string;
  driverParam: string | Date;
}, MsSqlDatetimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MsSqlDateTimeString<T extends ColumnBaseConfig<'string datetime'>> extends MsSqlColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: MsSqlTable<any>, config: MsSqlDateTimeStringBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: Date | string | null): string | null;
}
interface MsSqlDatetimeConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
  mode?: TMode;
}
declare function datetime<TMode extends MsSqlDatetimeConfig['mode'] & {}>(config?: MsSqlDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MsSqlDateTimeStringBuilder : MsSqlDateTimeBuilder;
declare function datetime<TMode extends MsSqlDatetimeConfig['mode'] & {}>(name: string, config?: MsSqlDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MsSqlDateTimeStringBuilder : MsSqlDateTimeBuilder;
//#endregion
export { MsSqlDateTime, MsSqlDateTimeBuilder, MsSqlDateTimeString, MsSqlDateTimeStringBuilder, MsSqlDatetimeConfig, datetime };
//# sourceMappingURL=datetime.d.ts.map