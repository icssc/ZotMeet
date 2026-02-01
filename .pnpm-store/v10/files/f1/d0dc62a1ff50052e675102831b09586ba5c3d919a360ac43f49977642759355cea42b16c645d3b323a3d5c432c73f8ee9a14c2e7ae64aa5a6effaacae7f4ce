import { CockroachColumn } from "./common.cjs";
import { CockroachIntColumnBaseBuilder } from "./int.common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/integer.d.ts
declare class CockroachIntegerBuilder extends CockroachIntColumnBaseBuilder<{
  dataType: 'number int32';
  data: number;
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class CockroachInteger<T extends ColumnBaseConfig<'number int32'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function int4(name?: string): CockroachIntegerBuilder;
//#endregion
export { CockroachInteger, CockroachIntegerBuilder, int4 };
//# sourceMappingURL=integer.d.cts.map