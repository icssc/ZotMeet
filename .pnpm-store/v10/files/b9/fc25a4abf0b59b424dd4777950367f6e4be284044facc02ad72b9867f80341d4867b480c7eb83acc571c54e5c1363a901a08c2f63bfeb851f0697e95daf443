import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/mysql-core/columns/serial.d.ts
declare class MySqlSerialBuilder extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: 'number uint53';
  data: number;
  driverParam: number;
  hasDefault: true;
  notNull: true;
  isPrimaryKey: true;
  isAutoincrement: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MySqlSerial<T extends ColumnBaseConfig<'number uint53'>> extends MySqlColumnWithAutoIncrement<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function serial(name?: string): MySqlSerialBuilder;
//#endregion
export { MySqlSerial, MySqlSerialBuilder, serial };
//# sourceMappingURL=serial.d.ts.map