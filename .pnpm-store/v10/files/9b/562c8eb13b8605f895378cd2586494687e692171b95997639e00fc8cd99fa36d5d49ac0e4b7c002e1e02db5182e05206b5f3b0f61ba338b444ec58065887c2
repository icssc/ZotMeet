import { MsSqlColumn } from "./common.cjs";
import { MsSqlDateColumnBaseBuilder } from "./date.common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { MsSqlTable } from "../table.cjs";

//#region src/mssql-core/columns/date.d.ts
declare class MsSqlDateBuilder extends MsSqlDateColumnBaseBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MsSqlDate<T extends ColumnBaseConfig<'object date'>> extends MsSqlColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: MsSqlTable<any>, config: MsSqlDateBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: Date | string): Date;
}
declare class MsSqlDateStringBuilder extends MsSqlDateColumnBaseBuilder<{
  dataType: 'string date';
  data: string;
  driverParam: string | number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MsSqlDateString<T extends ColumnBaseConfig<'string date'>> extends MsSqlColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: MsSqlTable<any>, config: MsSqlDateStringBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: Date | string | null): string | null;
}
interface MsSqlDateConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
  mode?: TMode;
}
declare function date<TMode extends MsSqlDateConfig['mode'] & {}>(config?: MsSqlDateConfig<TMode>): Equal<TMode, 'string'> extends true ? MsSqlDateStringBuilder : MsSqlDateBuilder;
declare function date<TMode extends MsSqlDateConfig['mode'] & {}>(name: string, config?: MsSqlDateConfig<TMode>): Equal<TMode, 'string'> extends true ? MsSqlDateStringBuilder : MsSqlDateBuilder;
//#endregion
export { MsSqlDate, MsSqlDateBuilder, MsSqlDateConfig, MsSqlDateString, MsSqlDateStringBuilder, date };
//# sourceMappingURL=date.d.cts.map