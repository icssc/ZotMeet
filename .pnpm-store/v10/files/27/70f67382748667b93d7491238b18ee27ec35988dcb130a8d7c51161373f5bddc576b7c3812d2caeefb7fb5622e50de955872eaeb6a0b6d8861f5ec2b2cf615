import { MsSqlColumn } from "./common.cjs";
import { MsSqlDateColumnBaseBuilder, MsSqlDatetimeConfig } from "./date.common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { MsSqlTable } from "../table.cjs";

//#region src/mssql-core/columns/datetime2.d.ts
declare class MsSqlDateTime2Builder extends MsSqlDateColumnBaseBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | Date;
}, MsSqlDatetimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlDatetimeConfig | undefined);
}
declare class MsSqlDateTime2<T extends ColumnBaseConfig<'object date'>> extends MsSqlColumn<T> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  constructor(table: MsSqlTable<any>, config: MsSqlDateTime2Builder['config']);
  getSQLType(): string;
}
declare class MsSqlDateTime2StringBuilder extends MsSqlDateColumnBaseBuilder<{
  dataType: 'string datetime';
  data: string;
  driverParam: string | Date;
}, MsSqlDatetimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlDatetimeConfig | undefined);
}
declare class MsSqlDateTime2String<T extends ColumnBaseConfig<'string datetime'>> extends MsSqlColumn<T> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  constructor(table: MsSqlTable<any>, config: MsSqlDateTime2StringBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: Date | string | null): string | null;
}
declare function datetime2<TMode extends MsSqlDatetimeConfig['mode'] & {}>(config?: MsSqlDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MsSqlDateTime2StringBuilder : MsSqlDateTime2Builder;
declare function datetime2<TMode extends MsSqlDatetimeConfig['mode'] & {}>(name: string, config?: MsSqlDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MsSqlDateTime2StringBuilder : MsSqlDateTime2Builder;
//#endregion
export { MsSqlDateTime2, MsSqlDateTime2Builder, MsSqlDateTime2String, MsSqlDateTime2StringBuilder, datetime2 };
//# sourceMappingURL=datetime2.d.cts.map