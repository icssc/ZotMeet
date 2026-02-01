import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal, Writable } from "../../utils.js";

//#region src/cockroach-core/columns/string.d.ts
declare class CockroachStringBuilder<TEnum extends [string, ...string[]]> extends CockroachColumnWithArrayBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  enumValues: TEnum;
  driverParam: string;
}, {
  enumValues: TEnum | undefined;
  length: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: CockroachStringConfig<TEnum>);
}
declare class CockroachString<T extends ColumnBaseConfig<'string' | 'string enum'>> extends CockroachColumn<T, {
  enumValues: [string, ...string[]] | undefined;
}> {
  static readonly [entityKind]: string;
  readonly enumValues: [string, ...string[]] | undefined;
  getSQLType(): string;
}
interface CockroachStringConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
  enum?: TEnum;
  length?: number | undefined;
}
interface CockroachTextConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
  enum?: TEnum;
}
declare function string(): CockroachStringBuilder<[string, ...string[]]>;
declare function string<U extends string, T extends Readonly<[U, ...U[]]>>(config?: CockroachStringConfig<T | Writable<T>>): CockroachStringBuilder<Writable<T>>;
declare function string<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: CockroachStringConfig<T | Writable<T>>): CockroachStringBuilder<Writable<T>>;
declare function text(): CockroachStringBuilder<[string, ...string[]]>;
declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(config?: CockroachTextConfig<T | Writable<T>>): CockroachStringBuilder<Writable<T>>;
declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: CockroachTextConfig<T | Writable<T>>): CockroachStringBuilder<Writable<T>>;
//#endregion
export { CockroachString, CockroachStringBuilder, CockroachStringConfig, CockroachTextConfig, string, text };
//# sourceMappingURL=string.d.ts.map