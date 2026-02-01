import { PgColumn, PgColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";

//#region src/pg-core/columns/macaddr.d.ts
declare class PgMacaddrBuilder extends PgColumnBuilder<{
  dataType: 'string macaddr';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgMacaddr extends PgColumn<'string macaddr'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function macaddr(name?: string): PgMacaddrBuilder;
//#endregion
export { PgMacaddr, PgMacaddrBuilder, macaddr };
//# sourceMappingURL=macaddr.d.cts.map