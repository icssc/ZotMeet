import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";

//#region src/mysql-core/columns/decimal.d.ts
declare class MySqlDecimalBuilder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'string unumeric' : 'string numeric';
  data: string;
  driverParam: string;
}, MySqlDecimalConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlDecimalConfig | undefined);
}
declare class MySqlDecimal<T extends ColumnBaseConfig<'string numeric' | 'string unumeric'>> extends MySqlColumnWithAutoIncrement<T, MySqlDecimalConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  readonly unsigned: boolean | undefined;
  mapFromDriverValue(value: unknown): string;
  getSQLType(): string;
}
declare class MySqlDecimalNumberBuilder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number unsigned' : 'number';
  data: number;
  driverParam: string;
}, MySqlDecimalConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlDecimalConfig | undefined);
}
declare class MySqlDecimalNumber<T extends ColumnBaseConfig<'number' | 'number unsigned'>> extends MySqlColumnWithAutoIncrement<T, MySqlDecimalConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  readonly unsigned: boolean | undefined;
  mapFromDriverValue(value: unknown): number;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
declare class MySqlDecimalBigIntBuilder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'bigint uint64' : 'bigint int64';
  data: bigint;
  driverParam: string;
}, MySqlDecimalConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlDecimalConfig | undefined);
}
declare class MySqlDecimalBigInt<T extends ColumnBaseConfig<'bigint int64' | 'bigint uint64'>> extends MySqlColumnWithAutoIncrement<T, MySqlDecimalConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  readonly unsigned: boolean | undefined;
  mapFromDriverValue: BigIntConstructor;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
interface MySqlDecimalConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint', TUnsigned extends boolean | undefined = boolean | undefined> {
  precision?: number;
  scale?: number;
  unsigned?: TUnsigned;
  mode?: T;
}
declare function decimal<TMode extends 'string' | 'number' | 'bigint', TUnsigned extends boolean | undefined>(config?: MySqlDecimalConfig<TMode, TUnsigned>): Equal<TMode, 'number'> extends true ? MySqlDecimalNumberBuilder<TUnsigned> : Equal<TMode, 'bigint'> extends true ? MySqlDecimalBigIntBuilder<TUnsigned> : MySqlDecimalBuilder<TUnsigned>;
declare function decimal<TMode extends 'string' | 'number' | 'bigint', TUnsigned extends boolean | undefined>(name: string, config?: MySqlDecimalConfig<TMode, TUnsigned>): Equal<TMode, 'number'> extends true ? MySqlDecimalNumberBuilder<TUnsigned> : Equal<TMode, 'bigint'> extends true ? MySqlDecimalBigIntBuilder<TUnsigned> : MySqlDecimalBuilder<TUnsigned>;
//#endregion
export { MySqlDecimal, MySqlDecimalBigInt, MySqlDecimalBigIntBuilder, MySqlDecimalBuilder, MySqlDecimalConfig, MySqlDecimalNumber, MySqlDecimalNumberBuilder, decimal };
//# sourceMappingURL=decimal.d.ts.map