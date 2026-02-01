import { CockroachColumn, CockroachColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { CockroachTable } from "../table.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/jsonb.d.ts
declare class CockroachJsonbBuilder extends CockroachColumnBuilder<{
  dataType: 'object json';
  data: unknown;
  driverParam: unknown;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class CockroachJsonb<T extends ColumnBaseConfig<'object json'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: CockroachTable<any>, config: CockroachJsonbBuilder['config']);
  getSQLType(): string;
  mapToDriverValue(value: T['data']): string;
  mapFromDriverValue(value: T['data'] | string): T['data'];
}
declare function jsonb(name?: string): CockroachJsonbBuilder;
//#endregion
export { CockroachJsonb, CockroachJsonbBuilder, jsonb };
//# sourceMappingURL=jsonb.d.cts.map