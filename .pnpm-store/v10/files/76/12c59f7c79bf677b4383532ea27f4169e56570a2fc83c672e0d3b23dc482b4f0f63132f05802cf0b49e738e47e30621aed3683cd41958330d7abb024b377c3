import { MsSqlColumn, MsSqlColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/time.d.ts
declare class MsSqlTimeStringBuilder extends MsSqlColumnBuilder<{
  dataType: 'string time';
  data: string;
  driverParam: string | Date;
}, TimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: TimeConfig | undefined);
}
declare class MsSqlTimeString<T extends ColumnBaseConfig<'string time'>> extends MsSqlColumn<T, TimeConfig> {
  static readonly [entityKind]: string;
  readonly fsp: number | undefined;
  getSQLType(): string;
  mapFromDriverValue(value: Date | string | null): string | null;
}
declare class MsSqlTimeBuilder extends MsSqlColumnBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | Date;
}, TimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: TimeConfig | undefined);
}
declare class MsSqlTime<T extends ColumnBaseConfig<'object date'>> extends MsSqlColumn<T, TimeConfig> {
  static readonly [entityKind]: string;
  readonly fsp: number | undefined;
  getSQLType(): string;
}
type TimeConfig<TMode extends 'date' | 'string' = 'date' | 'string'> = {
  precision?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  mode?: TMode;
};
declare function time<TMode extends TimeConfig['mode'] & {}>(config?: TimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MsSqlTimeStringBuilder : MsSqlTimeBuilder;
declare function time<TMode extends TimeConfig['mode'] & {}>(name: string, config?: TimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MsSqlTimeStringBuilder : MsSqlTimeBuilder;
//#endregion
export { MsSqlTime, MsSqlTimeBuilder, MsSqlTimeString, MsSqlTimeStringBuilder, TimeConfig, time };
//# sourceMappingURL=time.d.cts.map