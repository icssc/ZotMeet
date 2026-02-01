import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { CockroachTable } from "../table.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/real.d.ts
declare class CockroachRealBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'number float';
  data: number;
  driverParam: string | number;
}, {
  length: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, length?: number);
}
declare class CockroachReal<T extends ColumnBaseConfig<'number float'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: CockroachTable<any>, config: CockroachRealBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue: (value: string | number) => number;
}
declare function real(name?: string): CockroachRealBuilder;
//#endregion
export { CockroachReal, CockroachRealBuilder, real };
//# sourceMappingURL=real.d.cts.map