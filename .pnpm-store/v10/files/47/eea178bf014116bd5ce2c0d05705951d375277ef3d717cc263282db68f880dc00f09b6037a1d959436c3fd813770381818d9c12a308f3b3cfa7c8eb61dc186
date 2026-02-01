import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/cidr.d.ts
declare class PgCidrBuilder extends PgColumnBuilder<{
  dataType: 'string cidr';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgCidr extends PgColumn<'string cidr'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function cidr(name?: string): PgCidrBuilder;
//#endregion
export { PgCidr, PgCidrBuilder, cidr };
//# sourceMappingURL=cidr.d.ts.map