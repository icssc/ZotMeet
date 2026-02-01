import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { Equal, Writable } from "../../utils.js";
import { PgTable } from "../table.js";

//#region src/pg-core/columns/char.d.ts
type PgCharBuilderConfig<TEnum extends [string, ...string[]]> = Equal<TEnum, [string, ...string[]]> extends true ? {
  dataType: 'string';
  data: string;
  driverParam: string;
} : {
  dataType: 'string enum';
  data: TEnum[number];
  enumValues: TEnum;
  driverParam: string;
};
declare class PgCharBuilder<TEnum extends [string, ...string[]] = [string, ...string[]]> extends PgColumnBuilder<PgCharBuilderConfig<TEnum>, {
  enumValues: TEnum;
  length: number;
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: PgCharConfig<TEnum>);
}
declare class PgChar<TEnum extends [string, ...string[]] = [string, ...string[]]> extends PgColumn<Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum'> {
  static readonly [entityKind]: string;
  readonly enumValues: TEnum;
  private readonly setLength;
  constructor(table: PgTable<any>, config: PgCharBuilder<TEnum>['config']);
  getSQLType(): string;
}
interface PgCharConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
  enum?: TEnum;
  length?: number;
}
declare function char(): PgCharBuilder;
declare function char(name: string): PgCharBuilder;
declare function char(config: {
  length?: number;
}): PgCharBuilder;
declare function char(name: string, config: {
  length?: number;
}): PgCharBuilder;
declare function char<U extends string, T extends Readonly<[U, ...U[]]>>(config: PgCharConfig<T | Writable<T>> & {
  enum: T | Writable<T>;
}): PgCharBuilder<Writable<T>>;
declare function char<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config: PgCharConfig<T | Writable<T>> & {
  enum: T | Writable<T>;
}): PgCharBuilder<Writable<T>>;
//#endregion
export { PgChar, PgCharBuilder, PgCharConfig, char };
//# sourceMappingURL=char.d.ts.map