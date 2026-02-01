import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { Equal } from "../../utils.js";
import { PgTable } from "../table.js";

//#region src/pg-core/columns/numeric.d.ts
declare class PgNumericBuilder extends PgColumnBuilder<{
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
declare class PgNumeric extends PgColumn<'string numeric'> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  constructor(table: PgTable<any>, config: PgNumericBuilder['config']);
  mapFromDriverValue(value: unknown): string;
  getSQLType(): string;
}
declare class PgNumericNumberBuilder extends PgColumnBuilder<{
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
declare class PgNumericNumber extends PgColumn<'number'> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  constructor(table: PgTable<any>, config: PgNumericNumberBuilder['config']);
  mapFromDriverValue(value: unknown): number;
  mapToDriverValue(value: number): string;
  getSQLType(): string;
}
declare class PgNumericBigIntBuilder extends PgColumnBuilder<{
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
declare class PgNumericBigInt extends PgColumn<'bigint int64'> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  constructor(table: PgTable<any>, config: PgNumericBigIntBuilder['config']);
  mapFromDriverValue(value: string | number): bigint;
  mapToDriverValue(value: bigint): string;
  getSQLType(): string;
}
type PgNumericConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint'> = {
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
declare function numeric<TMode extends 'string' | 'number' | 'bigint'>(config?: PgNumericConfig<TMode>): Equal<TMode, 'number'> extends true ? PgNumericNumberBuilder : Equal<TMode, 'bigint'> extends true ? PgNumericBigIntBuilder : PgNumericBuilder;
declare function numeric<TMode extends 'string' | 'number' | 'bigint'>(name: string, config?: PgNumericConfig<TMode>): Equal<TMode, 'number'> extends true ? PgNumericNumberBuilder : Equal<TMode, 'bigint'> extends true ? PgNumericBigIntBuilder : PgNumericBuilder;
declare const decimal: typeof numeric;
//#endregion
export { PgNumeric, PgNumericBigInt, PgNumericBigIntBuilder, PgNumericBuilder, PgNumericConfig, PgNumericNumber, PgNumericNumberBuilder, decimal, numeric };
//# sourceMappingURL=numeric.d.ts.map