import { PgIntColumnBuilder } from "./int.common.cjs";
import { PgColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";

//#region src/pg-core/columns/integer.d.ts
declare class PgIntegerBuilder extends PgIntColumnBuilder<{
  dataType: 'number int32';
  data: number;
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgInteger extends PgColumn<'number int32'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function integer(name?: string): PgIntegerBuilder;
//#endregion
export { PgInteger, PgIntegerBuilder, integer };
//# sourceMappingURL=integer.d.cts.map