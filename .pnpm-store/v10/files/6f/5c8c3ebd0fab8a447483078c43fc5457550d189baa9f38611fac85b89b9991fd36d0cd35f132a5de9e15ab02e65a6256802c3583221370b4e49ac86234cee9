import { PgIntColumnBuilder } from "./int.common.cjs";
import { PgColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";

//#region src/pg-core/columns/smallint.d.ts
declare class PgSmallIntBuilder extends PgIntColumnBuilder<{
  dataType: 'number int16';
  data: number;
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgSmallInt extends PgColumn<'number int16'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function smallint(name?: string): PgSmallIntBuilder;
//#endregion
export { PgSmallInt, PgSmallIntBuilder, smallint };
//# sourceMappingURL=smallint.d.cts.map