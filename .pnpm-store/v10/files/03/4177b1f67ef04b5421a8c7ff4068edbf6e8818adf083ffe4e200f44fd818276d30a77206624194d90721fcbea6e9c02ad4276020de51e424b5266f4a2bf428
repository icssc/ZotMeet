import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/mysql-core/columns/json.d.ts
declare class MySqlJsonBuilder extends MySqlColumnBuilder<{
  dataType: 'object json';
  data: unknown;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MySqlJson<T extends ColumnBaseConfig<'object json'>> extends MySqlColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapToDriverValue(value: T['data']): string;
}
declare function json(name?: string): MySqlJsonBuilder;
//#endregion
export { MySqlJson, MySqlJsonBuilder, json };
//# sourceMappingURL=json.d.ts.map