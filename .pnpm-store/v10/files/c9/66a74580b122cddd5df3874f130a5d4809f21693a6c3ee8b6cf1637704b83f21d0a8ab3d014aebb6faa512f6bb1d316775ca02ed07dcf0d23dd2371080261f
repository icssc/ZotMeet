import { MsSqlColumn, MsSqlColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal, Writable } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/char.d.ts
declare class MsSqlCharBuilder<TEnum extends [string, ...string[]]> extends MsSqlColumnBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  driverParam: number | string;
  enumValues: TEnum;
}, MsSqlCharConfig<TEnum>> {
  static readonly [entityKind]: string;
}
declare class MsSqlChar<T extends ColumnBaseConfig<'string' | 'string enum'>> extends MsSqlColumn<T, MsSqlCharConfig<T['enumValues']>> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"] | undefined;
  readonly nonUnicode: boolean;
  getSQLType(): string;
}
type MsSqlCharConfig<TEnum extends string[] | readonly string[] | undefined> = MsSqlCharConfigInitial<TEnum> & {
  nonUnicode: boolean;
};
type MsSqlCharConfigInitial<TEnum extends string[] | readonly string[] | undefined = string[] | readonly string[] | undefined> = {
  length?: number;
  enum?: TEnum;
};
declare function char<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MsSqlCharConfigInitial<T | Writable<T>>): MsSqlCharBuilder<Writable<T>>;
declare function char<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: MsSqlCharConfigInitial<T | Writable<T>>): MsSqlCharBuilder<Writable<T>>;
declare function nchar<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MsSqlCharConfigInitial<T | Writable<T>>): MsSqlCharBuilder<Writable<T>>;
declare function nchar<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: MsSqlCharConfigInitial<T | Writable<T>>): MsSqlCharBuilder<Writable<T>>;
//#endregion
export { MsSqlChar, MsSqlCharBuilder, MsSqlCharConfig, MsSqlCharConfigInitial, char, nchar };
//# sourceMappingURL=char.d.cts.map