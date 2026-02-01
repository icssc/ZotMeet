import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/boolean.d.ts
declare class PgBooleanBuilder extends PgColumnBuilder<{
  dataType: 'boolean';
  data: boolean;
  driverParam: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgBoolean extends PgColumn<'boolean'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function boolean(name?: string): PgBooleanBuilder;
//#endregion
export { PgBoolean, PgBooleanBuilder, boolean };
//# sourceMappingURL=boolean.d.ts.map