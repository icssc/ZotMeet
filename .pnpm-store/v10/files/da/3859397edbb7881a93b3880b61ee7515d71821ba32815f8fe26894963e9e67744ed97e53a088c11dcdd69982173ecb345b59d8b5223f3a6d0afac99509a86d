import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/mysql-core/columns/binary.d.ts
declare class MySqlBinaryBuilder extends MySqlColumnBuilder<{
  dataType: 'string binary';
  data: string;
  driverParam: string;
}, MySqlBinaryConfig & {
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, length: number | undefined);
}
declare class MySqlBinary<T extends ColumnBaseConfig<'string binary'>> extends MySqlColumn<T, MySqlBinaryConfig & {
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  mapFromDriverValue(value: string | Buffer | Uint8Array): string;
  getSQLType(): string;
}
interface MySqlBinaryConfig {
  length?: number;
}
declare function binary(config?: MySqlBinaryConfig): MySqlBinaryBuilder;
declare function binary(name: string, config?: MySqlBinaryConfig): MySqlBinaryBuilder;
//#endregion
export { MySqlBinary, MySqlBinaryBuilder, MySqlBinaryConfig, binary };
//# sourceMappingURL=binary.d.ts.map