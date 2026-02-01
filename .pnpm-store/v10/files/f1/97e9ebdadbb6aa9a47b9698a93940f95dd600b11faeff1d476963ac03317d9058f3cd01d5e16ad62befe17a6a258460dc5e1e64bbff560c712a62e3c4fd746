import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Duration } from "gel";

//#region src/gel-core/columns/duration.d.ts
declare class GelDurationBuilder extends GelColumnBuilder<{
  dataType: 'object duration';
  data: Duration;
  driverParam: Duration;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelDuration<T extends ColumnBaseConfig<'object duration'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function duration(name?: string): GelDurationBuilder;
//#endregion
export { GelDuration, GelDurationBuilder, duration };
//# sourceMappingURL=duration.d.ts.map