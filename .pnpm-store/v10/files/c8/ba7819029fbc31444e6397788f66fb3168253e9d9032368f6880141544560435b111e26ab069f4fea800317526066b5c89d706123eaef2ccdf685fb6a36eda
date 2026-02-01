import { MySqlStringBaseColumn, MySqlStringColumnBaseBuilder } from "./string.common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal, Writable } from "../../utils.js";

//#region src/mysql-core/columns/text.d.ts
type MySqlTextColumnType = 'tinytext' | 'text' | 'mediumtext' | 'longtext';
declare class MySqlTextBuilder<TEnum extends [string, ...string[]]> extends MySqlStringColumnBaseBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  driverParam: string;
  enumValues: TEnum;
}, {
  textType: MySqlTextColumnType;
  enumValues?: TEnum;
  length: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, textType: MySqlTextColumnType, config: MySqlTextConfig<TEnum>);
}
declare class MySqlText<T extends ColumnBaseConfig<'string' | 'string enum'>> extends MySqlStringBaseColumn<T, {
  textType: MySqlTextColumnType;
  enumValues: T['enumValues'];
}> {
  static readonly [entityKind]: string;
  readonly textType: MySqlTextColumnType;
  readonly enumValues: T["enumValues"];
  getSQLType(): string;
}
interface MySqlTextConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
  enum?: TEnum;
}
declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilder<Writable<T>>;
declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilder<Writable<T>>;
declare function tinytext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilder<Writable<T>>;
declare function tinytext<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilder<Writable<T>>;
declare function mediumtext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilder<Writable<T>>;
declare function mediumtext<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilder<Writable<T>>;
declare function longtext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilder<Writable<T>>;
declare function longtext<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilder<Writable<T>>;
//#endregion
export { MySqlText, MySqlTextBuilder, MySqlTextColumnType, MySqlTextConfig, longtext, mediumtext, text, tinytext };
//# sourceMappingURL=text.d.ts.map