import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { PgTable } from "../table.js";

//#region src/pg-core/columns/real.d.ts
declare class PgRealBuilder extends PgColumnBuilder<{
  dataType: 'number float';
  data: number;
  driverParam: string | number;
}, {
  length: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, length?: number);
}
declare class PgReal extends PgColumn<'number float'> {
  static readonly [entityKind]: string;
  constructor(table: PgTable<any>, config: PgRealBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: string | number): number;
}
declare function real(name?: string): PgRealBuilder;
//#endregion
export { PgReal, PgRealBuilder, real };
//# sourceMappingURL=real.d.ts.map