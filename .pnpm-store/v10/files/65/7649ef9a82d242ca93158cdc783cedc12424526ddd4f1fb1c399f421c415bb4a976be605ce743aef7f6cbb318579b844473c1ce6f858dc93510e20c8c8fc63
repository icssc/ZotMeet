import { GelColumn, GelColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/gel-core/columns/double-precision.d.ts
declare class GelDoublePrecisionBuilder extends GelColumnBuilder<{
  dataType: 'number double';
  data: number;
  driverParam: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelDoublePrecision<T extends ColumnBaseConfig<'number double'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string | number): number;
}
declare function doublePrecision(name?: string): GelDoublePrecisionBuilder;
//#endregion
export { GelDoublePrecision, GelDoublePrecisionBuilder, doublePrecision };
//# sourceMappingURL=double-precision.d.cts.map