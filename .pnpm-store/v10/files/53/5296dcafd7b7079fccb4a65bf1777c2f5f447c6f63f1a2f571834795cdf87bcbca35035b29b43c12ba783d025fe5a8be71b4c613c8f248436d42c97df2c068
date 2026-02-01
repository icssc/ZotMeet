import { PgColumn, PgColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";

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
//# sourceMappingURL=boolean.d.cts.map