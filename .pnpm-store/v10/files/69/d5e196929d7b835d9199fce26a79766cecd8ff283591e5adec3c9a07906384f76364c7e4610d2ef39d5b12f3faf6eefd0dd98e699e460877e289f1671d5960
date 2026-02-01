import { CockroachColumn } from "./common.js";
import { CockroachIntColumnBaseBuilder } from "./int.common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/cockroach-core/columns/bigint.d.ts
declare class CockroachBigInt53Builder extends CockroachIntColumnBaseBuilder<{
  dataType: 'number int53';
  data: number;
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class CockroachBigInt53<T extends ColumnBaseConfig<'number int53'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare class CockroachBigInt64Builder extends CockroachIntColumnBaseBuilder<{
  dataType: 'bigint int64';
  data: bigint;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class CockroachBigInt64<T extends ColumnBaseConfig<'bigint int64'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string): bigint;
}
interface CockroachBigIntConfig<T extends 'number' | 'bigint' = 'number' | 'bigint'> {
  mode: T;
}
declare function bigint<TMode extends CockroachBigIntConfig['mode']>(config: CockroachBigIntConfig<TMode>): TMode extends 'number' ? CockroachBigInt53Builder : CockroachBigInt64Builder;
declare function bigint<TMode extends CockroachBigIntConfig['mode']>(name: string, config: CockroachBigIntConfig<TMode>): TMode extends 'number' ? CockroachBigInt53Builder : CockroachBigInt64Builder;
declare function int8<TMode extends CockroachBigIntConfig['mode']>(config: CockroachBigIntConfig<TMode>): TMode extends 'number' ? CockroachBigInt53Builder : CockroachBigInt64Builder;
declare function int8<TMode extends CockroachBigIntConfig['mode']>(name: string, config: CockroachBigIntConfig<TMode>): TMode extends 'number' ? CockroachBigInt53Builder : CockroachBigInt64Builder;
//#endregion
export { CockroachBigInt53, CockroachBigInt53Builder, CockroachBigInt64, CockroachBigInt64Builder, CockroachBigIntConfig, bigint, int8 };
//# sourceMappingURL=bigint.d.ts.map