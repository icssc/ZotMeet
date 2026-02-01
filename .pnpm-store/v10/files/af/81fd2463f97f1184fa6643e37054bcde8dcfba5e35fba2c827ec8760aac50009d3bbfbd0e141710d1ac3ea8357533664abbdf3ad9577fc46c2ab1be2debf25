import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { NonArray, Writable } from "../../utils.js";
import { CockroachTable } from "../table.js";

//#region src/cockroach-core/columns/enum.d.ts
interface CockroachEnumObject<TValues extends object> {
  (name?: string): CockroachEnumObjectColumnBuilder<TValues>;
  readonly enumName: string;
  readonly enumValues: string[];
  readonly schema: string | undefined;
}
declare class CockroachEnumObjectColumnBuilder<TValues extends object> extends CockroachColumnWithArrayBuilder<{
  dataType: 'string enum';
  data: TValues[keyof TValues];
  enumValues: string[];
  driverParam: string;
}, {
  enum: CockroachEnumObject<any>;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, enumInstance: CockroachEnumObject<any>);
}
declare class CockroachEnumObjectColumn<T extends ColumnBaseConfig<'string enum'> & {
  enumValues: object;
}> extends CockroachColumn<T, {
  enum: CockroachEnumObject<object>;
}> {
  static readonly [entityKind]: string;
  readonly enum: CockroachEnumObject<any>;
  readonly enumValues: string[];
  constructor(table: CockroachTable<any>, config: CockroachEnumObjectColumnBuilder<T>['config']);
  getSQLType(): string;
}
interface CockroachEnum<TValues extends [string, ...string[]]> {
  (name?: string): CockroachEnumColumnBuilder<TValues>;
  readonly enumName: string;
  readonly enumValues: TValues;
  readonly schema: string | undefined;
}
declare function isCockroachEnum(obj: unknown): obj is CockroachEnum<[string, ...string[]]>;
declare class CockroachEnumColumnBuilder<TValues extends [string, ...string[]]> extends CockroachColumnWithArrayBuilder<{
  dataType: 'string';
  data: TValues[number];
  enumValues: TValues;
  driverParam: string;
}, {
  enum: CockroachEnum<TValues>;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, enumInstance: CockroachEnum<TValues>);
}
declare class CockroachEnumColumn<T extends ColumnBaseConfig<'string enum'> & {
  enumValues: [string, ...string[]];
}> extends CockroachColumn<T, {
  enum: CockroachEnum<T['enumValues']>;
}> {
  static readonly [entityKind]: string;
  readonly enum: CockroachEnum<T["enumValues"]>;
  readonly enumValues: T["enumValues"];
  constructor(table: CockroachTable<any>, config: CockroachEnumColumnBuilder<T['enumValues']>['config']);
  getSQLType(): string;
}
declare function cockroachEnum<U extends string, T extends Readonly<[U, ...U[]]>>(enumName: string, values: T | Writable<T>): CockroachEnum<Writable<T>>;
declare function cockroachEnum<E extends Record<string, string>>(enumName: string, enumObj: NonArray<E>): CockroachEnumObject<E>;
//#endregion
export { CockroachEnum, CockroachEnumColumn, CockroachEnumColumnBuilder, CockroachEnumObject, CockroachEnumObjectColumn, CockroachEnumObjectColumnBuilder, cockroachEnum, isCockroachEnum };
//# sourceMappingURL=enum.d.ts.map