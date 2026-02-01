import { GelLocalDateColumnBaseBuilder } from "./date.common.cjs";
import { GelColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { AnyGelTable } from "../table.cjs";

//#region src/gel-core/columns/timestamptz.d.ts
declare class GelTimestampTzBuilder extends GelLocalDateColumnBaseBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: Date;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelTimestampTz<T extends ColumnBaseConfig<'object date'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnyGelTable<{
    name: T['tableName'];
  }>, config: GelTimestampTzBuilder['config']);
  mapFromDriverValue(value: unknown): Date;
  getSQLType(): string;
}
declare function timestamptz(name?: string): GelTimestampTzBuilder;
//#endregion
export { GelTimestampTz, GelTimestampTzBuilder, timestamptz };
//# sourceMappingURL=timestamptz.d.cts.map