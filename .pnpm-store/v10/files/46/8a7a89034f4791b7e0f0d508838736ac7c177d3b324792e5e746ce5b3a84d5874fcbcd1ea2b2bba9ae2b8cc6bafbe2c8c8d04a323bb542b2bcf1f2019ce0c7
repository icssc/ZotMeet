import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/inet.d.ts
declare class PgInetBuilder extends PgColumnBuilder<{
  dataType: 'string inet';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgInet extends PgColumn<'string inet'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function inet(name?: string): PgInetBuilder;
//#endregion
export { PgInet, PgInetBuilder, inet };
//# sourceMappingURL=inet.d.ts.map