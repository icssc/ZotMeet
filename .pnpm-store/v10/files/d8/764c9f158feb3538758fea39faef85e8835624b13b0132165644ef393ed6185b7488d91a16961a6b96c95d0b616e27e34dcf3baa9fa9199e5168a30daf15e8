import { PgColumn, PgColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { PgTable } from "../table.cjs";

//#region src/pg-core/columns/jsonb.d.ts
declare class PgJsonbBuilder extends PgColumnBuilder<{
  dataType: 'object json';
  data: unknown;
  driverParam: unknown;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgJsonb extends PgColumn<'object json'> {
  static readonly [entityKind]: string;
  constructor(table: PgTable<any>, config: PgJsonbBuilder['config']);
  getSQLType(): string;
  mapToDriverValue(value: unknown): string;
  mapFromDriverValue(value: unknown): unknown;
}
declare function jsonb(name?: string): PgJsonbBuilder;
//#endregion
export { PgJsonb, PgJsonbBuilder, jsonb };
//# sourceMappingURL=jsonb.d.cts.map