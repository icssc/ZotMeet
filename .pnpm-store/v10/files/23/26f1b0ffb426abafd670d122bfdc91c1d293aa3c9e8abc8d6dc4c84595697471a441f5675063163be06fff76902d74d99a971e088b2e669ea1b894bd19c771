import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal, Writable } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/text.d.ts
type SingleStoreTextColumnType = 'tinytext' | 'text' | 'mediumtext' | 'longtext';
declare class SingleStoreTextBuilder<TEnum extends [string, ...string[]]> extends SingleStoreColumnBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  driverParam: string;
  enumValues: TEnum;
}, {
  textType: SingleStoreTextColumnType;
  enumValues?: TEnum;
  length: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, textType: SingleStoreTextColumnType, config: SingleStoreTextConfig<TEnum>);
}
declare class SingleStoreText<T extends ColumnBaseConfig<'string' | 'string enum'>> extends SingleStoreColumn<T, {
  textType: SingleStoreTextColumnType;
  enumValues: T['enumValues'];
}> {
  static readonly [entityKind]: string;
  readonly textType: SingleStoreTextColumnType;
  readonly enumValues: T["enumValues"];
  getSQLType(): string;
}
interface SingleStoreTextConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
  enum?: TEnum;
}
declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilder<Writable<T>>;
declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilder<Writable<T>>;
declare function tinytext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilder<Writable<T>>;
declare function tinytext<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilder<Writable<T>>;
declare function mediumtext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilder<Writable<T>>;
declare function mediumtext<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilder<Writable<T>>;
declare function longtext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilder<Writable<T>>;
declare function longtext<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilder<Writable<T>>;
//#endregion
export { SingleStoreText, SingleStoreTextBuilder, SingleStoreTextColumnType, SingleStoreTextConfig, longtext, mediumtext, text, tinytext };
//# sourceMappingURL=text.d.cts.map