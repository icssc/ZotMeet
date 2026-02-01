import { GelColumn, GelColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { AnyGelTable } from "../table.cjs";

//#region src/gel-core/columns/json.d.ts
declare class GelJsonBuilder extends GelColumnBuilder<{
  dataType: 'object json';
  data: unknown;
  driverParam: unknown;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelJson<T extends ColumnBaseConfig<'object json'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnyGelTable<{
    name: T['tableName'];
  }>, config: GelJsonBuilder['config']);
  getSQLType(): string;
}
declare function json(name?: string): GelJsonBuilder;
//#endregion
export { GelJson, GelJsonBuilder, json };
//# sourceMappingURL=json.d.cts.map