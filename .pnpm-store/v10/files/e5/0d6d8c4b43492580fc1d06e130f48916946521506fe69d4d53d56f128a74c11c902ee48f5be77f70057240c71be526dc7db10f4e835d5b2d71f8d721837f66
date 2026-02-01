import { SQLiteColumn, SQLiteColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";

//#region src/sqlite-core/columns/numeric.d.ts
declare class SQLiteNumericBuilder extends SQLiteColumnBuilder<{
  dataType: 'string numeric';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SQLiteNumeric<T extends ColumnBaseConfig<'string numeric'>> extends SQLiteColumn<T> {
  static readonly [entityKind]: string;
  mapFromDriverValue(value: unknown): string;
  getSQLType(): string;
}
declare class SQLiteNumericNumberBuilder extends SQLiteColumnBuilder<{
  dataType: 'number';
  data: number;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SQLiteNumericNumber<T extends ColumnBaseConfig<'number'>> extends SQLiteColumn<T> {
  static readonly [entityKind]: string;
  mapFromDriverValue(value: unknown): number;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
declare class SQLiteNumericBigIntBuilder extends SQLiteColumnBuilder<{
  dataType: 'bigint int64';
  data: bigint;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SQLiteNumericBigInt<T extends ColumnBaseConfig<'bigint int64'>> extends SQLiteColumn<T> {
  static readonly [entityKind]: string;
  mapFromDriverValue: BigIntConstructor;
  mapToDriverValue: StringConstructor;
  getSQLType(): string;
}
type SQLiteNumericConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint'> = {
  mode: T;
};
declare function numeric<TMode extends SQLiteNumericConfig['mode']>(config?: SQLiteNumericConfig<TMode>): Equal<TMode, 'number'> extends true ? SQLiteNumericNumberBuilder : Equal<TMode, 'bigint'> extends true ? SQLiteNumericBigIntBuilder : SQLiteNumericBuilder;
declare function numeric<TMode extends SQLiteNumericConfig['mode']>(name: string, config?: SQLiteNumericConfig<TMode>): Equal<TMode, 'number'> extends true ? SQLiteNumericNumberBuilder : Equal<TMode, 'bigint'> extends true ? SQLiteNumericBigIntBuilder : SQLiteNumericBuilder;
//#endregion
export { SQLiteNumeric, SQLiteNumericBigInt, SQLiteNumericBigIntBuilder, SQLiteNumericBuilder, SQLiteNumericConfig, SQLiteNumericNumber, SQLiteNumericNumberBuilder, numeric };
//# sourceMappingURL=numeric.d.ts.map