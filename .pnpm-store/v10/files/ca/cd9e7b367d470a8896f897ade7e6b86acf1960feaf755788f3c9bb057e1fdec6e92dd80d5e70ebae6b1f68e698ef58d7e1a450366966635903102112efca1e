import { PgIntColumnBuilder } from "./int.common.cjs";
import { PgColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";

//#region src/pg-core/columns/bigint.d.ts
declare class PgBigInt53Builder extends PgIntColumnBuilder<{
  dataType: 'number int53';
  data: number;
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgBigInt53 extends PgColumn<'number int53'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare class PgBigInt64Builder extends PgIntColumnBuilder<{
  dataType: 'bigint int64';
  data: bigint;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgBigInt64 extends PgColumn<'bigint int64'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string): bigint;
}
declare class PgBigIntStringBuilder extends PgIntColumnBuilder<{
  dataType: 'string int64';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgBigIntString extends PgColumn<'string int64'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string | number): string;
}
interface PgBigIntConfig<T extends 'number' | 'bigint' | 'string' = 'number' | 'bigint' | 'string'> {
  mode: T;
}
declare function bigint<TMode extends PgBigIntConfig['mode']>(config: PgBigIntConfig<TMode>): TMode extends 'string' ? PgBigIntStringBuilder : TMode extends 'bigint' ? PgBigInt64Builder : PgBigInt53Builder;
declare function bigint<TMode extends PgBigIntConfig['mode']>(name: string, config: PgBigIntConfig<TMode>): TMode extends 'string' ? PgBigIntStringBuilder : TMode extends 'bigint' ? PgBigInt64Builder : PgBigInt53Builder;
//#endregion
export { PgBigInt53, PgBigInt53Builder, PgBigInt64, PgBigInt64Builder, PgBigIntConfig, PgBigIntString, PgBigIntStringBuilder, bigint };
//# sourceMappingURL=bigint.d.cts.map