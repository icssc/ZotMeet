import { MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/int.d.ts
declare class MsSqlIntBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'number int32';
  data: number;
  driverParam: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MsSqlInt<T extends ColumnBaseConfig<'number int32'>> extends MsSqlColumnWithIdentity<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function int(name?: string): MsSqlIntBuilder;
//#endregion
export { MsSqlInt, MsSqlIntBuilder, int };
//# sourceMappingURL=int.d.cts.map