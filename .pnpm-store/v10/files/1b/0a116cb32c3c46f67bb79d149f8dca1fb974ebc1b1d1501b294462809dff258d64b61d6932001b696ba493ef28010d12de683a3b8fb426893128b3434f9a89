import { PgColumn, PgColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal, Writable } from "../../utils.cjs";
import { PgTable } from "../table.cjs";

//#region src/pg-core/columns/varchar.d.ts
type PgVarcharBuilderConfig<TEnum extends [string, ...string[]]> = Equal<TEnum, [string, ...string[]]> extends true ? {
  dataType: 'string';
  data: string;
  driverParam: string;
} : {
  dataType: 'string enum';
  data: TEnum[number];
  enumValues: TEnum;
  driverParam: string;
};
declare class PgVarcharBuilder<TEnum extends [string, ...string[]] = [string, ...string[]]> extends PgColumnBuilder<PgVarcharBuilderConfig<TEnum>, {
  length: number | undefined;
  enumValues: TEnum;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: PgVarcharConfig<TEnum>);
}
declare class PgVarchar<TEnum extends [string, ...string[]] = [string, ...string[]]> extends PgColumn<Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum'> {
  static readonly [entityKind]: string;
  readonly enumValues: TEnum;
  constructor(table: PgTable<any>, config: PgVarcharBuilder<TEnum>['config']);
  getSQLType(): string;
}
interface PgVarcharConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
  enum?: TEnum;
  length?: number;
}
declare function varchar(): PgVarcharBuilder;
declare function varchar(name: string): PgVarcharBuilder;
declare function varchar(config: {
  length?: number;
}): PgVarcharBuilder;
declare function varchar(name: string, config: {
  length?: number;
}): PgVarcharBuilder;
declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>>(config: PgVarcharConfig<T | Writable<T>> & {
  enum: T | Writable<T>;
}): PgVarcharBuilder<Writable<T>>;
declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config: PgVarcharConfig<T | Writable<T>> & {
  enum: T | Writable<T>;
}): PgVarcharBuilder<Writable<T>>;
//#endregion
export { PgVarchar, PgVarcharBuilder, PgVarcharConfig, varchar };
//# sourceMappingURL=varchar.d.cts.map