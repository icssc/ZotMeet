import { MsSqlColumn, MsSqlColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal, Writable } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { MsSqlTable } from "../table.cjs";

//#region src/mssql-core/columns/text.d.ts
declare class MsSqlTextBuilder<TEnum extends [string, ...string[]]> extends MsSqlColumnBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  driverParam: string;
  enumValues: TEnum;
}, {
  enumValues: TEnum | undefined;
  nonUnicode: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlTextConfig<TEnum> & {
    nonUnicode: boolean;
  });
}
declare class MsSqlText<T extends ColumnBaseConfig<'string' | 'string enum'>> extends MsSqlColumn<T, {
  enumValues: T['enumValues'] | undefined;
  nonUnicode: boolean;
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"] | undefined;
  readonly nonUnicode: boolean;
  constructor(table: MsSqlTable<any>, config: MsSqlTextBuilder<[string, ...string[]]>['config']);
  getSQLType(): string;
}
type MsSqlTextConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> = {
  enum?: TEnum;
};
declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MsSqlTextConfig<T | Writable<T>>): MsSqlTextBuilder<Writable<T>>;
declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: MsSqlTextConfig<T | Writable<T>>): MsSqlTextBuilder<Writable<T>>;
declare function ntext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MsSqlTextConfig<T | Writable<T>>): MsSqlTextBuilder<Writable<T>>;
declare function ntext<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: MsSqlTextConfig<T | Writable<T>>): MsSqlTextBuilder<Writable<T>>;
//#endregion
export { MsSqlText, MsSqlTextBuilder, MsSqlTextConfig, ntext, text };
//# sourceMappingURL=text.d.cts.map