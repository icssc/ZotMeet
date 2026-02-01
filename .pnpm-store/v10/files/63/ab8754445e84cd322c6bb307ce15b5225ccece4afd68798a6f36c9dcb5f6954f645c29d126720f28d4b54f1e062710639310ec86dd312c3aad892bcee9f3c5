import { GelIntColumnBaseBuilder } from "./int.common.cjs";
import { GelColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/gel-core/columns/smallint.d.ts
declare class GelSmallIntBuilder extends GelIntColumnBaseBuilder<{
  dataType: 'number int16';
  data: number;
  driverParam: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelSmallInt<T extends ColumnBaseConfig<'number int16' | 'number uint16'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function smallint(name?: string): GelSmallIntBuilder;
//#endregion
export { GelSmallInt, GelSmallIntBuilder, smallint };
//# sourceMappingURL=smallint.d.cts.map