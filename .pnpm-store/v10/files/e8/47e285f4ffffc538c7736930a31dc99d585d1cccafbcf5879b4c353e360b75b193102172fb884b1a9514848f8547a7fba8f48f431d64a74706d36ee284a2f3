import { MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/real.d.ts
declare class MsSqlRealBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'number float';
  data: number;
  driverParam: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MsSqlReal<T extends ColumnBaseConfig<'number float'>> extends MsSqlColumnWithIdentity<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function real(name?: string): MsSqlRealBuilder;
//#endregion
export { MsSqlReal, MsSqlRealBuilder, real };
//# sourceMappingURL=real.d.cts.map