import { GelColumn, GelColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { DateDuration } from "gel";

//#region src/gel-core/columns/date-duration.d.ts
declare class GelDateDurationBuilder extends GelColumnBuilder<{
  dataType: 'object dateDuration';
  data: DateDuration;
  driverParam: DateDuration;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelDateDuration<T extends ColumnBaseConfig<'object dateDuration'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function dateDuration(name?: string): GelDateDurationBuilder;
//#endregion
export { GelDateDuration, GelDateDurationBuilder, dateDuration };
//# sourceMappingURL=date-duration.d.cts.map