import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { PgTable } from "../table.js";

//#region src/pg-core/columns/json.d.ts
declare class PgJsonBuilder extends PgColumnBuilder<{
  dataType: 'object json';
  data: unknown;
  driverParam: unknown;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgJson extends PgColumn<'object json'> {
  static readonly [entityKind]: string;
  constructor(table: PgTable<any>, config: PgJsonBuilder['config']);
  getSQLType(): string;
  mapToDriverValue(value: unknown): string;
  mapFromDriverValue(value: unknown): unknown;
}
declare function json(name?: string): PgJsonBuilder;
//#endregion
export { PgJson, PgJsonBuilder, json };
//# sourceMappingURL=json.d.ts.map