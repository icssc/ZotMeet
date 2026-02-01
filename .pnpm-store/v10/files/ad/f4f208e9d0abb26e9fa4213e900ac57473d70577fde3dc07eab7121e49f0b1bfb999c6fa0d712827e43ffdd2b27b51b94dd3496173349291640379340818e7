import { MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";

//#region src/mssql-core/columns/numeric.d.ts
declare class MsSqlNumericBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'string numeric';
  data: string;
  driverParam: string;
}, MsSqlNumericConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlNumericConfig | undefined);
}
declare class MsSqlNumeric<T extends ColumnBaseConfig<'string numeric'>> extends MsSqlColumnWithIdentity<T, MsSqlNumericConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  mapFromDriverValue(value: unknown): string;
  getSQLType(): string;
}
declare class MsSqlNumericNumberBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'number';
  data: number;
  driverParam: string;
}, MsSqlNumericConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlNumericConfig | undefined);
}
declare class MsSqlNumericNumber<T extends ColumnBaseConfig<'number'>> extends MsSqlColumnWithIdentity<T, MsSqlNumericConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  mapFromDriverValue(value: unknown): number;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
declare class MsSqlNumericBigIntBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'bigint int64';
  data: bigint;
  driverParam: string;
}, MsSqlNumericConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlNumericConfig | undefined);
}
declare class MsSqlNumericBigInt<T extends ColumnBaseConfig<'bigint int64'>> extends MsSqlColumnWithIdentity<T, MsSqlNumericConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  mapFromDriverValue: BigIntConstructor;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
interface MsSqlNumericConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint'> {
  precision?: number;
  scale?: number;
  mode?: T;
}
declare function numeric<TMode extends 'string' | 'number' | 'bigint'>(config?: MsSqlNumericConfig<TMode>): Equal<TMode, 'number'> extends true ? MsSqlNumericNumberBuilder : Equal<TMode, 'bigint'> extends true ? MsSqlNumericBigIntBuilder : MsSqlNumericBuilder;
declare function numeric<TMode extends 'string' | 'number' | 'bigint'>(name: string, config?: MsSqlNumericConfig<TMode>): Equal<TMode, 'number'> extends true ? MsSqlNumericNumberBuilder : Equal<TMode, 'bigint'> extends true ? MsSqlNumericBigIntBuilder : MsSqlNumericBuilder;
//#endregion
export { MsSqlNumeric, MsSqlNumericBigInt, MsSqlNumericBigIntBuilder, MsSqlNumericBuilder, MsSqlNumericConfig, MsSqlNumericNumber, MsSqlNumericNumberBuilder, numeric };
//# sourceMappingURL=numeric.d.ts.map