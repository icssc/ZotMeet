import { MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/smallint.d.ts
declare class MsSqlSmallIntBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'number int16';
  data: number;
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MsSqlSmallInt<T extends ColumnBaseConfig<'number int16'>> extends MsSqlColumnWithIdentity<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function smallint(name?: string): MsSqlSmallIntBuilder;
//#endregion
export { MsSqlSmallInt, MsSqlSmallIntBuilder, smallint };
//# sourceMappingURL=smallint.d.cts.map