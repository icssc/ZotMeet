import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/cockroach-core/columns/float.d.ts
declare class CockroachFloatBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'number double';
  data: number;
  driverParam: string | number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class CockroachFloat<T extends ColumnBaseConfig<'number double'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string | number): number;
}
declare function float(name?: string): CockroachFloatBuilder;
declare const doublePrecision: typeof float;
//#endregion
export { CockroachFloat, CockroachFloatBuilder, doublePrecision, float };
//# sourceMappingURL=float.d.ts.map