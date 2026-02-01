import { SQLiteColumn, SQLiteColumnBuilder } from "./common.cjs";
import { SQLiteTable } from "../table.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal, Or } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { ColumnBuilderBaseConfig, ColumnType, HasDefault, IsPrimaryKey, NotNull } from "../../column-builder.cjs";
import { OnConflict } from "../utils.cjs";

//#region src/sqlite-core/columns/integer.d.ts
interface PrimaryKeyConfig {
  autoIncrement?: boolean;
  onConflict?: OnConflict;
}
declare abstract class SQLiteBaseIntegerBuilder<T extends ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object> extends SQLiteColumnBuilder<T, TRuntimeConfig & {
  autoIncrement: boolean;
}, {
  primaryKeyHasDefault: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, dataType: T['dataType'], columnType: string);
  primaryKey(config?: PrimaryKeyConfig): IsPrimaryKey<HasDefault<NotNull<this>>>;
}
declare abstract class SQLiteBaseInteger<T extends ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = object> extends SQLiteColumn<T, TRuntimeConfig & {
  autoIncrement: boolean;
}> {
  static readonly [entityKind]: string;
  readonly autoIncrement: boolean;
  getSQLType(): string;
}
declare class SQLiteIntegerBuilder extends SQLiteBaseIntegerBuilder<{
  dataType: 'number int53';
  data: number;
  driverParam: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
  build(table: SQLiteTable): SQLiteInteger<ColumnBaseConfig<"number int53">>;
}
declare class SQLiteInteger<T extends ColumnBaseConfig<'number int53'>> extends SQLiteBaseInteger<T> {
  static readonly [entityKind]: string;
}
declare class SQLiteTimestampBuilder extends SQLiteBaseIntegerBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: number;
}, {
  mode: 'timestamp' | 'timestamp_ms';
}> {
  static readonly [entityKind]: string;
  constructor(name: string, mode: 'timestamp' | 'timestamp_ms');
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow(): HasDefault<this>;
  build(table: SQLiteTable): SQLiteTimestamp<ColumnBaseConfig<"object date">>;
}
declare class SQLiteTimestamp<T extends ColumnBaseConfig<'object date'>> extends SQLiteBaseInteger<T, {
  mode: 'timestamp' | 'timestamp_ms';
}> {
  static readonly [entityKind]: string;
  readonly mode: 'timestamp' | 'timestamp_ms';
  mapFromDriverValue(value: number | string): Date;
  mapToDriverValue(value: Date | number): number;
}
declare class SQLiteBooleanBuilder extends SQLiteBaseIntegerBuilder<{
  dataType: 'boolean';
  data: boolean;
  driverParam: number;
}, {
  mode: 'boolean';
}> {
  static readonly [entityKind]: string;
  constructor(name: string, mode: 'boolean');
  build(table: SQLiteTable): SQLiteBoolean<ColumnBaseConfig<"boolean">>;
}
declare class SQLiteBoolean<T extends ColumnBaseConfig<'boolean'>> extends SQLiteBaseInteger<T, {
  mode: 'boolean';
}> {
  static readonly [entityKind]: string;
  readonly mode: 'boolean';
  mapFromDriverValue(value: number): boolean;
  mapToDriverValue(value: boolean): number;
}
interface IntegerConfig<TMode extends 'number' | 'timestamp' | 'timestamp_ms' | 'boolean' = 'number' | 'timestamp' | 'timestamp_ms' | 'boolean'> {
  mode: TMode;
}
declare function integer<TMode extends IntegerConfig['mode']>(config?: IntegerConfig<TMode>): Or<Equal<TMode, 'timestamp'>, Equal<TMode, 'timestamp_ms'>> extends true ? SQLiteTimestampBuilder : Equal<TMode, 'boolean'> extends true ? SQLiteBooleanBuilder : SQLiteIntegerBuilder;
declare function integer<TMode extends IntegerConfig['mode']>(name: string, config?: IntegerConfig<TMode>): Or<Equal<TMode, 'timestamp'>, Equal<TMode, 'timestamp_ms'>> extends true ? SQLiteTimestampBuilder : Equal<TMode, 'boolean'> extends true ? SQLiteBooleanBuilder : SQLiteIntegerBuilder;
declare const int: typeof integer;
//#endregion
export { IntegerConfig, PrimaryKeyConfig, SQLiteBaseInteger, SQLiteBaseIntegerBuilder, SQLiteBoolean, SQLiteBooleanBuilder, SQLiteInteger, SQLiteIntegerBuilder, SQLiteTimestamp, SQLiteTimestampBuilder, int, integer };
//# sourceMappingURL=integer.d.cts.map