import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { AnyGelTable } from "../table.js";

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
//# sourceMappingURL=json.d.ts.map