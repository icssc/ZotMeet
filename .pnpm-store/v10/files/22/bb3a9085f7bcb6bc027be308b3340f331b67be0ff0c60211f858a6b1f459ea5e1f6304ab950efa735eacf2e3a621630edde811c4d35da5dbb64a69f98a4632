import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/smallserial.d.ts
declare class PgSmallSerialBuilder extends PgColumnBuilder<{
  dataType: 'number int16';
  data: number;
  driverParam: number;
  notNull: true;
  hasDefault: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgSmallSerial extends PgColumn<'number int16'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function smallserial(name?: string): PgSmallSerialBuilder;
//#endregion
export { PgSmallSerial, PgSmallSerialBuilder, smallserial };
//# sourceMappingURL=smallserial.d.ts.map