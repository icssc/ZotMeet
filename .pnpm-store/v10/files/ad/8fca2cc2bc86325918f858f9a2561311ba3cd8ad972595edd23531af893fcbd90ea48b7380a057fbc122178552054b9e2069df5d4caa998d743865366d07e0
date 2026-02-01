import { MySqlStringBaseColumn, MySqlStringColumnBaseBuilder } from "./string.common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal, Writable } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mysql-core/columns/varchar.d.ts
declare class MySqlVarCharBuilder<TEnum extends [string, ...string[]]> extends MySqlStringColumnBaseBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  driverParam: number | string;
  enumValues: TEnum;
}, MySqlVarCharConfig<TEnum>> {
  static readonly [entityKind]: string;
}
declare class MySqlVarChar<T extends ColumnBaseConfig<'string' | 'string enum'> & {
  length: number;
}> extends MySqlStringBaseColumn<T, MySqlVarCharConfig<T['enumValues']>> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"] | undefined;
  getSQLType(): string;
}
interface MySqlVarCharConfig<TEnum extends string[] | readonly string[] | undefined = string[] | readonly string[] | undefined> {
  enum?: TEnum;
  length: number;
}
declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>>(config: MySqlVarCharConfig<T | Writable<T>>): MySqlVarCharBuilder<Writable<T>>;
declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config: MySqlVarCharConfig<T | Writable<T>>): MySqlVarCharBuilder<Writable<T>>;
//#endregion
export { MySqlVarChar, MySqlVarCharBuilder, MySqlVarCharConfig, varchar };
//# sourceMappingURL=varchar.d.cts.map