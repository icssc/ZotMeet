import { MsSqlColumn } from "./common.cjs";
import { MsSqlDateColumnBaseBuilder, MsSqlDatetimeConfig } from "./date.common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { MsSqlTable } from "../table.cjs";

//#region src/mssql-core/columns/datetimeoffset.d.ts
declare class MsSqlDateTimeOffsetBuilder extends MsSqlDateColumnBaseBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | Date;
}, MsSqlDatetimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlDatetimeConfig | undefined);
}
declare class MsSqlDateTimeOffset<T extends ColumnBaseConfig<'object date'>> extends MsSqlColumn<T> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  constructor(table: MsSqlTable<any>, config: MsSqlDateTimeOffsetBuilder['config']);
  getSQLType(): string;
}
declare class MsSqlDateTimeOffsetStringBuilder extends MsSqlDateColumnBaseBuilder<{
  dataType: 'string datetime';
  data: string;
  driverParam: string | Date;
}, MsSqlDatetimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlDatetimeConfig | undefined);
}
declare class MsSqlDateTimeOffsetString<T extends ColumnBaseConfig<'string datetime'>> extends MsSqlColumn<T> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  constructor(table: MsSqlTable<any>, config: MsSqlDateTimeOffsetStringBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: Date | string | null): string | null;
}
declare function datetimeoffset(): MsSqlDateTimeOffsetBuilder;
declare function datetimeoffset<TMode extends MsSqlDatetimeConfig['mode'] & {}>(config?: MsSqlDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MsSqlDateTimeOffsetStringBuilder : MsSqlDateTimeOffsetBuilder;
declare function datetimeoffset<TMode extends MsSqlDatetimeConfig['mode'] & {}>(name: string, config?: MsSqlDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MsSqlDateTimeOffsetStringBuilder : MsSqlDateTimeOffsetBuilder;
//#endregion
export { MsSqlDateTimeOffset, MsSqlDateTimeOffsetBuilder, MsSqlDateTimeOffsetString, MsSqlDateTimeOffsetStringBuilder, datetimeoffset };
//# sourceMappingURL=datetimeoffset.d.cts.map