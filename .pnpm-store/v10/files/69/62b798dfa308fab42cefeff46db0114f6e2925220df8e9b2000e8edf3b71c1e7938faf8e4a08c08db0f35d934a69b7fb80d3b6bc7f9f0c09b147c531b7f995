import { MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/tinyint.d.ts
declare class MsSqlTinyIntBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'number uint8';
  data: number;
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MsSqlTinyInt<T extends ColumnBaseConfig<'number uint8'>> extends MsSqlColumnWithIdentity<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function tinyint(name?: string): MsSqlTinyIntBuilder;
//#endregion
export { MsSqlTinyInt, MsSqlTinyIntBuilder, tinyint };
//# sourceMappingURL=tinyint.d.cts.map