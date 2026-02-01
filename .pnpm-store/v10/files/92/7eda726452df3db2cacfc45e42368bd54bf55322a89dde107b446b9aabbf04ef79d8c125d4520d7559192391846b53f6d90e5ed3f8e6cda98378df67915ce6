import { PgColumn, PgColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";

//#region src/pg-core/columns/macaddr8.d.ts
declare class PgMacaddr8Builder extends PgColumnBuilder<{
  dataType: 'string macaddr8';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgMacaddr8 extends PgColumn<'string macaddr8'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function macaddr8(name?: string): PgMacaddr8Builder;
//#endregion
export { PgMacaddr8, PgMacaddr8Builder, macaddr8 };
//# sourceMappingURL=macaddr8.d.cts.map