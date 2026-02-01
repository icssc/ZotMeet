import { MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/bit.d.ts
declare class MsSqlBitBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'boolean';
  data: boolean;
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MsSqlBit<T extends ColumnBaseConfig<'boolean'>> extends MsSqlColumnWithIdentity<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue: BooleanConstructor;
}
declare function bit(name?: string): MsSqlBitBuilder;
//#endregion
export { MsSqlBit, MsSqlBitBuilder, bit };
//# sourceMappingURL=bit.d.cts.map