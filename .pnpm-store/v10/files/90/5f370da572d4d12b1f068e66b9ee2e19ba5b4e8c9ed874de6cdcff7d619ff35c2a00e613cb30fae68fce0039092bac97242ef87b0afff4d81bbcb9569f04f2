import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
import { GelColumn } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { LocalDateTime } from "gel";
import { AnyGelTable } from "../table.js";

//#region src/gel-core/columns/timestamp.d.ts
declare class GelTimestampBuilder extends GelLocalDateColumnBaseBuilder<{
  dataType: 'object localDateTime';
  data: LocalDateTime;
  driverParam: LocalDateTime;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelTimestamp<T extends ColumnBaseConfig<'object localDateTime'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnyGelTable<{
    name: T['tableName'];
  }>, config: GelTimestampBuilder['config']);
  getSQLType(): string;
}
declare function timestamp(name?: string): GelTimestampBuilder;
//#endregion
export { GelTimestamp, GelTimestampBuilder, timestamp };
//# sourceMappingURL=timestamp.d.ts.map