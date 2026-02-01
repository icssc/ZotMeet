import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
import { GelColumn } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { LocalDate } from "gel";

//#region src/gel-core/columns/localdate.d.ts
declare class GelLocalDateStringBuilder extends GelLocalDateColumnBaseBuilder<{
  dataType: 'object localDate';
  data: LocalDate;
  driverParam: LocalDate;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelLocalDateString<T extends ColumnBaseConfig<'object localDate'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function localDate(name?: string): GelLocalDateStringBuilder;
//#endregion
export { GelLocalDateString, GelLocalDateStringBuilder, localDate };
//# sourceMappingURL=localdate.d.ts.map