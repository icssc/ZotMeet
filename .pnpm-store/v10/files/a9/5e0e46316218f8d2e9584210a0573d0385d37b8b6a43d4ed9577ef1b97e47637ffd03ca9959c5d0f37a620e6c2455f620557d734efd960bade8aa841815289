import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/serial.d.ts
declare class PgSerialBuilder extends PgColumnBuilder<{
  dataType: 'number int32';
  data: number;
  driverParam: number;
  notNull: true;
  hasDefault: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgSerial extends PgColumn<'number int32'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function serial(name?: string): PgSerialBuilder;
//#endregion
export { PgSerial, PgSerialBuilder, serial };
//# sourceMappingURL=serial.d.ts.map