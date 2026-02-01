import { MySqlStringBaseColumn, MySqlStringColumnBaseBuilder } from "./string.common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal, Writable } from "../../utils.js";

//#region src/mysql-core/columns/char.d.ts
declare class MySqlCharBuilder<TEnum extends [string, ...string[]]> extends MySqlStringColumnBaseBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  driverParam: number | string;
  enumValues: TEnum;
}, {
  enum?: TEnum;
  length: number;
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlCharConfig<TEnum>);
}
declare class MySqlChar<T extends ColumnBaseConfig<'string' | 'string enum'>> extends MySqlStringBaseColumn<T, {
  enum?: T['enumValues'];
  length: number;
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"] | undefined;
  getSQLType(): string;
}
interface MySqlCharConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
  enum?: TEnum;
  length?: number;
}
declare function char<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MySqlCharConfig<T | Writable<T>>): MySqlCharBuilder<Writable<T>>;
declare function char<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: MySqlCharConfig<T | Writable<T>>): MySqlCharBuilder<Writable<T>>;
//#endregion
export { MySqlChar, MySqlCharBuilder, MySqlCharConfig, char };
//# sourceMappingURL=char.d.ts.map