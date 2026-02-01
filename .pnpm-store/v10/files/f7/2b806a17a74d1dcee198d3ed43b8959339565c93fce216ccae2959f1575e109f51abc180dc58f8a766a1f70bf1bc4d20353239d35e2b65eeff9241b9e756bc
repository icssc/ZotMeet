import { PgColumn, PgColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { NonArray, Writable } from "../../utils.cjs";
import { PgTable } from "../table.cjs";

//#region src/pg-core/columns/enum.d.ts
interface PgEnumObject<TValues extends object> {
  (name?: string): PgEnumObjectColumnBuilder<TValues>;
  readonly enumName: string;
  readonly enumValues: string[];
  readonly schema: string | undefined;
}
declare class PgEnumObjectColumnBuilder<TValues extends object> extends PgColumnBuilder<{
  dataType: 'string enum';
  data: TValues[keyof TValues];
  enumValues: string[];
  driverParam: string;
}, {
  enum: PgEnumObject<any>;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, enumInstance: PgEnumObject<any>);
}
declare class PgEnumObjectColumn<TValues extends object> extends PgColumn<'string enum'> {
  static readonly [entityKind]: string;
  readonly enum: PgEnumObject<TValues>;
  readonly enumValues: string[];
  constructor(table: PgTable<any>, config: PgEnumObjectColumnBuilder<TValues>['config']);
  getSQLType(): string;
}
interface PgEnum<TValues extends [string, ...string[]]> {
  (name?: string): PgEnumColumnBuilder<TValues>;
  readonly enumName: string;
  readonly enumValues: TValues;
  readonly schema: string | undefined;
}
declare function isPgEnum(obj: unknown): obj is PgEnum<[string, ...string[]]>;
declare class PgEnumColumnBuilder<TValues extends [string, ...string[]]> extends PgColumnBuilder<{
  dataType: 'string enum';
  data: TValues[number];
  enumValues: TValues;
  driverParam: string;
}, {
  enum: PgEnum<TValues>;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, enumInstance: PgEnum<TValues>);
}
declare class PgEnumColumn<TValues extends [string, ...string[]]> extends PgColumn<'string enum'> {
  static readonly [entityKind]: string;
  readonly enum: PgEnum<TValues>;
  readonly enumValues: TValues;
  constructor(table: PgTable<any>, config: PgEnumColumnBuilder<TValues>['config']);
  getSQLType(): string;
}
declare function pgEnum<U extends string, T extends Readonly<[U, ...U[]]>>(enumName: string, values: T | Writable<T>): PgEnum<Writable<T>>;
declare function pgEnum<E extends Record<string, string>>(enumName: string, enumObj: NonArray<E>): PgEnumObject<E>;
//#endregion
export { PgEnum, PgEnumColumn, PgEnumColumnBuilder, PgEnumObject, PgEnumObjectColumn, PgEnumObjectColumnBuilder, isPgEnum, pgEnum };
//# sourceMappingURL=enum.d.cts.map