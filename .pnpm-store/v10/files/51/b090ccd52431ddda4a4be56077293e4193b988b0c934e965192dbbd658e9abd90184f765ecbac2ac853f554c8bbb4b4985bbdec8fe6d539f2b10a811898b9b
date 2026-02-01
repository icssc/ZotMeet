import { GelLocalDateColumnBaseBuilder } from "./date.common.cjs";
import { GelColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { AnyGelTable } from "../table.cjs";
import { LocalDateTime } from "gel";

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
//# sourceMappingURL=timestamp.d.cts.map