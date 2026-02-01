import { MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/decimal.d.ts
declare class MsSqlDecimalBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'string numeric';
  data: string;
  driverParam: string;
}, MsSqlDecimalConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlDecimalConfig | undefined);
}
declare class MsSqlDecimal<T extends ColumnBaseConfig<'string numeric'>> extends MsSqlColumnWithIdentity<T, MsSqlDecimalConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  mapFromDriverValue(value: unknown): string;
  getSQLType(): string;
}
declare class MsSqlDecimalNumberBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'number';
  data: number;
  driverParam: string;
}, MsSqlDecimalConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlDecimalConfig | undefined);
}
declare class MsSqlDecimalNumber<T extends ColumnBaseConfig<'number'>> extends MsSqlColumnWithIdentity<T, MsSqlDecimalConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  mapFromDriverValue(value: unknown): number;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
declare class MsSqlDecimalBigIntBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'bigint int64';
  data: bigint;
  driverParam: string;
}, MsSqlDecimalConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlDecimalConfig | undefined);
}
declare class MsSqlDecimalBigInt<T extends ColumnBaseConfig<'bigint int64'>> extends MsSqlColumnWithIdentity<T, MsSqlDecimalConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  mapFromDriverValue: BigIntConstructor;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
interface MsSqlDecimalConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint'> {
  precision?: number;
  scale?: number;
  mode?: T;
}
declare function decimal<TMode extends 'string' | 'number' | 'bigint'>(config?: MsSqlDecimalConfig<TMode>): Equal<TMode, 'number'> extends true ? MsSqlDecimalNumberBuilder : Equal<TMode, 'bigint'> extends true ? MsSqlDecimalBigIntBuilder : MsSqlDecimalBuilder;
declare function decimal<TMode extends 'string' | 'number' | 'bigint'>(name: string, config?: MsSqlDecimalConfig<TMode>): Equal<TMode, 'number'> extends true ? MsSqlDecimalNumberBuilder : Equal<TMode, 'bigint'> extends true ? MsSqlDecimalBigIntBuilder : MsSqlDecimalBuilder;
//#endregion
export { MsSqlDecimal, MsSqlDecimalBigInt, MsSqlDecimalBigIntBuilder, MsSqlDecimalBuilder, MsSqlDecimalConfig, MsSqlDecimalNumber, MsSqlDecimalNumberBuilder, decimal };
//# sourceMappingURL=decimal.d.cts.map