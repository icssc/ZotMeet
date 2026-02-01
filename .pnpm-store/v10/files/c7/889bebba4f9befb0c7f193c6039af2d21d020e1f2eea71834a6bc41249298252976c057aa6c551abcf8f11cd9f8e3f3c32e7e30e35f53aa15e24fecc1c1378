import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";
import { CockroachTable } from "../table.js";

//#region src/cockroach-core/columns/decimal.d.ts
declare class CockroachDecimalBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'string numeric';
  data: string;
  driverParam: string;
}, {
  precision: number | undefined;
  scale: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, precision?: number, scale?: number);
}
declare class CockroachDecimal<T extends ColumnBaseConfig<'string numeric'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  constructor(table: CockroachTable<any>, config: CockroachDecimalBuilder['config']);
  mapFromDriverValue(value: unknown): string;
  getSQLType(): string;
}
declare class CockroachDecimalNumberBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'number';
  data: number;
  driverParam: string;
}, {
  precision: number | undefined;
  scale: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, precision?: number, scale?: number);
}
declare class CockroachDecimalNumber<T extends ColumnBaseConfig<'number'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  constructor(table: CockroachTable<any>, config: CockroachDecimalNumberBuilder['config']);
  mapFromDriverValue(value: unknown): number;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
declare class CockroachDecimalBigIntBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'bigint int64';
  data: bigint;
  driverParam: string;
}, {
  precision: number | undefined;
  scale: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, precision?: number, scale?: number);
}
declare class CockroachDecimalBigInt<T extends ColumnBaseConfig<'bigint int64'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  constructor(table: CockroachTable<any>, config: CockroachDecimalBigIntBuilder['config']);
  mapFromDriverValue: BigIntConstructor;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
type CockroachDecimalConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint'> = {
  precision: number;
  scale?: number;
  mode?: T;
} | {
  precision?: number;
  scale: number;
  mode?: T;
} | {
  precision?: number;
  scale?: number;
  mode: T;
};
declare function decimal<TMode extends 'string' | 'number' | 'bigint'>(config?: CockroachDecimalConfig<TMode>): Equal<TMode, 'number'> extends true ? CockroachDecimalNumberBuilder : Equal<TMode, 'bigint'> extends true ? CockroachDecimalBigIntBuilder : CockroachDecimalBuilder;
declare function decimal<TMode extends 'string' | 'number' | 'bigint'>(name: string, config?: CockroachDecimalConfig<TMode>): Equal<TMode, 'number'> extends true ? CockroachDecimalNumberBuilder : Equal<TMode, 'bigint'> extends true ? CockroachDecimalBigIntBuilder : CockroachDecimalBuilder;
declare const numeric: typeof decimal;
//#endregion
export { CockroachDecimal, CockroachDecimalBigInt, CockroachDecimalBigIntBuilder, CockroachDecimalBuilder, CockroachDecimalConfig, CockroachDecimalNumber, CockroachDecimalNumberBuilder, decimal, numeric };
//# sourceMappingURL=decimal.d.ts.map