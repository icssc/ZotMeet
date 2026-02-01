import { MsSqlColumn, MsSqlColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/varbinary.d.ts
declare class MsSqlVarBinaryBuilder extends MsSqlColumnBuilder<{
  dataType: 'object buffer';
  data: Buffer;
  driverParam: Buffer;
}, MsSqlVarbinaryOptions & {
  rawLength: MsSqlVarbinaryOptions['length'] | undefined;
}> {
  static readonly [entityKind]: string;
}
declare class MsSqlVarBinary<T extends ColumnBaseConfig<'object buffer'>> extends MsSqlColumn<T, MsSqlVarbinaryOptions & {
  rawLength: MsSqlVarbinaryOptions['length'] | undefined;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
interface MsSqlVarbinaryOptions {
  length: number | 'max';
}
declare function varbinary(config?: MsSqlVarbinaryOptions): MsSqlVarBinaryBuilder;
declare function varbinary(name: string, config?: MsSqlVarbinaryOptions): MsSqlVarBinaryBuilder;
//#endregion
export { MsSqlVarBinary, MsSqlVarBinaryBuilder, MsSqlVarbinaryOptions, varbinary };
//# sourceMappingURL=varbinary.d.cts.map