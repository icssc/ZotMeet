import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
import { GelColumn } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { LocalTime } from "gel";

//#region src/gel-core/columns/localtime.d.ts
declare class GelLocalTimeBuilder extends GelLocalDateColumnBaseBuilder<{
  dataType: 'object localTime';
  data: LocalTime;
  driverParam: LocalTime;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelLocalTime<T extends ColumnBaseConfig<'object localTime'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function localTime(name?: string): GelLocalTimeBuilder;
//#endregion
export { GelLocalTime, GelLocalTimeBuilder, localTime };
//# sourceMappingURL=localtime.d.ts.map