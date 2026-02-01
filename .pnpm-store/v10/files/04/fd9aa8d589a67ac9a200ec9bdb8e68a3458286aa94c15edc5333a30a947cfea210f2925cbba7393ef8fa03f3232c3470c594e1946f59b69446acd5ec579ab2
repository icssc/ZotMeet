import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/json.d.ts
declare class SingleStoreJsonBuilder extends SingleStoreColumnBuilder<{
  dataType: 'object json';
  data: unknown;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SingleStoreJson<T extends ColumnBaseConfig<'object json'>> extends SingleStoreColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapToDriverValue(value: T['data']): string;
}
declare function json(name?: string): SingleStoreJsonBuilder;
//#endregion
export { SingleStoreJson, SingleStoreJsonBuilder, json };
//# sourceMappingURL=json.d.cts.map