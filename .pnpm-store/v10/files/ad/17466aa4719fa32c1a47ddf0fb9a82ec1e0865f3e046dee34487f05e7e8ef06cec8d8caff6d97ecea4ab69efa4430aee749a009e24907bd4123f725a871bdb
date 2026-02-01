import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/mysql-core/columns/varbinary.d.ts
declare class MySqlVarBinaryBuilder extends MySqlColumnBuilder<{
  dataType: 'string binary';
  data: string;
  driverParam: string;
}, MySqlVarbinaryOptions> {
  static readonly [entityKind]: string;
}
declare class MySqlVarBinary<T extends ColumnBaseConfig<'string binary'>> extends MySqlColumn<T, MySqlVarbinaryOptions> {
  static readonly [entityKind]: string;
  mapFromDriverValue(value: string | Buffer | Uint8Array): string;
  getSQLType(): string;
}
interface MySqlVarbinaryOptions {
  length: number;
}
declare function varbinary(config: MySqlVarbinaryOptions): MySqlVarBinaryBuilder;
declare function varbinary(name: string, config: MySqlVarbinaryOptions): MySqlVarBinaryBuilder;
//#endregion
export { MySqlVarBinary, MySqlVarBinaryBuilder, MySqlVarbinaryOptions, varbinary };
//# sourceMappingURL=varbinary.d.ts.map