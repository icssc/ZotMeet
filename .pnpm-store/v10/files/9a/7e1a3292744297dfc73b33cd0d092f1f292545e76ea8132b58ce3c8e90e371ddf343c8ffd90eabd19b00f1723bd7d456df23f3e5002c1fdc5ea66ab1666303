import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/decimal.d.ts
declare class SingleStoreDecimalBuilder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'string unumeric' : 'string numeric';
  data: string;
  driverParam: string;
}, SingleStoreDecimalConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: SingleStoreDecimalConfig | undefined);
}
declare class SingleStoreDecimal<T extends ColumnBaseConfig<'string numeric' | 'string unumeric'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreDecimalConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  readonly unsigned: boolean | undefined;
  mapFromDriverValue(value: unknown): string;
  getSQLType(): string;
}
declare class SingleStoreDecimalNumberBuilder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number unsigned' : 'number';
  data: number;
  driverParam: string;
}, SingleStoreDecimalConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: SingleStoreDecimalConfig | undefined);
}
declare class SingleStoreDecimalNumber<T extends ColumnBaseConfig<'number' | 'number unsigned'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreDecimalConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  readonly unsigned: boolean | undefined;
  mapFromDriverValue(value: unknown): number;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
declare class SingleStoreDecimalBigIntBuilder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'bigint uint64' : 'bigint int64';
  data: bigint;
  driverParam: string;
}, SingleStoreDecimalConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: SingleStoreDecimalConfig | undefined);
}
declare class SingleStoreDecimalBigInt<T extends ColumnBaseConfig<'bigint int64' | 'bigint uint64'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreDecimalConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  readonly unsigned: boolean | undefined;
  mapFromDriverValue: BigIntConstructor;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
interface SingleStoreDecimalConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint', TUnsigned extends boolean | undefined = boolean | undefined> {
  precision?: number;
  scale?: number;
  unsigned?: TUnsigned;
  mode?: T;
}
declare function decimal<TMode extends 'string' | 'number' | 'bigint', TUnsigned extends boolean | undefined>(config?: SingleStoreDecimalConfig<TMode, TUnsigned>): Equal<TMode, 'number'> extends true ? SingleStoreDecimalNumberBuilder<TUnsigned> : Equal<TMode, 'bigint'> extends true ? SingleStoreDecimalBigIntBuilder<TUnsigned> : SingleStoreDecimalBuilder<TUnsigned>;
declare function decimal<TMode extends 'string' | 'number' | 'bigint', TUnsigned extends boolean | undefined>(name: string, config?: SingleStoreDecimalConfig<TMode, TUnsigned>): Equal<TMode, 'number'> extends true ? SingleStoreDecimalNumberBuilder<TUnsigned> : Equal<TMode, 'bigint'> extends true ? SingleStoreDecimalBigIntBuilder<TUnsigned> : SingleStoreDecimalBuilder<TUnsigned>;
//#endregion
export { SingleStoreDecimal, SingleStoreDecimalBigInt, SingleStoreDecimalBigIntBuilder, SingleStoreDecimalBuilder, SingleStoreDecimalConfig, SingleStoreDecimalNumber, SingleStoreDecimalNumberBuilder, decimal };
//# sourceMappingURL=decimal.d.cts.map