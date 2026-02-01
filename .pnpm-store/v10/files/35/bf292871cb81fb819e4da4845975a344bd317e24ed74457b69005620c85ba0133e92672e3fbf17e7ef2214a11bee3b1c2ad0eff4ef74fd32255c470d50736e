import { GelColumn, GelColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { AnyGelTable } from "../table.cjs";

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
//# sourceMappingURL=decimal.d.cts.map