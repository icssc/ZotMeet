import { GelLocalDateColumnBaseBuilder } from "./date.common.cjs";
import { GelColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
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
//# sourceMappingURL=localdate.d.cts.map