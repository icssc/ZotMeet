import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { AnyGelTable } from "../table.js";

//#region src/gel-core/columns/decimal.d.ts
declare class GelDecimalBuilder extends GelColumnBuilder<{
  dataType: 'string numeric';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelDecimal<T extends ColumnBaseConfig<'string numeric'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnyGelTable<{
    name: T['tableName'];
  }>, config: GelDecimalBuilder['config']);
  getSQLType(): string;
}
declare function decimal(name?: string): GelDecimalBuilder;
//#endregion
export { GelDecimal, GelDecimalBuilder, decimal };
//# sourceMappingURL=decimal.d.ts.map