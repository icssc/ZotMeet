import { MsSqlColumn, MsSqlColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/binary.d.ts
declare class MsSqlBinaryBuilder extends MsSqlColumnBuilder<{
  dataType: 'object buffer';
  data: Buffer;
  driverParam: Buffer;
}, MsSqlBinaryConfig & {
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, length: number | undefined);
}
declare class MsSqlBinary<T extends ColumnBaseConfig<'object buffer'>> extends MsSqlColumn<T, MsSqlBinaryConfig & {
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
interface MsSqlBinaryConfig {
  length?: number;
}
declare function binary(config?: MsSqlBinaryConfig): MsSqlBinaryBuilder;
declare function binary(name: string, config?: MsSqlBinaryConfig): MsSqlBinaryBuilder;
//#endregion
export { MsSqlBinary, MsSqlBinaryBuilder, MsSqlBinaryConfig, binary };
//# sourceMappingURL=binary.d.cts.map