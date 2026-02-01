import { MsSqlColumn, MsSqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal, Writable } from "../../utils.js";

//#region src/mssql-core/columns/varchar.d.ts
declare class MsSqlVarCharBuilder<TEnum extends [string, ...string[]]> extends MsSqlColumnBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  driverParam: number | string;
  enumValues: TEnum;
}, MsSqlVarCharConfig<'text', TEnum> & {
  rawLength: number | 'max' | undefined;
}> {
  static readonly [entityKind]: string;
}
declare class MsSqlVarChar<T extends ColumnBaseConfig<'string' | 'string enum'>> extends MsSqlColumn<T, MsSqlVarCharConfig<'text', T['enumValues']> & {
  rawLength: number | 'max' | undefined;
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"] | undefined;
  readonly nonUnicode: boolean;
  getSQLType(): string;
}
declare class MsSqlVarCharJsonBuilder extends MsSqlColumnBuilder<{
  dataType: 'object json';
  data: unknown;
  driverParam: string;
}, {
  length: number;
  nonUnicode: boolean;
  rawLength: number | 'max' | undefined;
}> {
  static readonly [entityKind]: string;
}
declare class MsSqlVarCharJson<T extends ColumnBaseConfig<'object json'>> extends MsSqlColumn<T, {
  length: number;
  nonUnicode: boolean;
  rawLength: number | 'max' | undefined;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string): T['data'];
  mapToDriverValue(value: T['data']): string;
}
type MsSqlVarCharConfig<TMode extends 'text' | 'json', TEnum extends string[] | readonly string[] | undefined> = MsSqlVarCharConfigInitial<TMode, TEnum> & {
  nonUnicode: boolean;
};
type MsSqlVarCharConfigInitial<TMode extends 'text' | 'json' = 'text' | 'json', TEnum extends string[] | readonly string[] | undefined = string[] | readonly string[] | undefined> = TMode extends 'text' ? {
  mode?: TMode;
  length?: number | 'max';
  enum?: TEnum;
} : {
  mode?: TMode;
  length?: number | 'max';
};
declare function varchar(): MsSqlVarCharBuilder<[string, ...string[]]>;
declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MsSqlVarCharConfigInitial<'text', T | Writable<T>>): MsSqlVarCharBuilder<Writable<T>>;
declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: MsSqlVarCharConfigInitial<'text', T | Writable<T>>): MsSqlVarCharBuilder<Writable<T>>;
declare function nvarchar<U extends string, T extends Readonly<[U, ...U[]]>, TMode extends 'text' | 'json' = 'text' | 'json'>(config?: MsSqlVarCharConfigInitial<TMode, T | Writable<T>>): Equal<TMode, 'json'> extends true ? MsSqlVarCharJsonBuilder : MsSqlVarCharBuilder<Writable<T>>;
declare function nvarchar<U extends string, T extends Readonly<[U, ...U[]]>, TMode extends 'text' | 'json' = 'text' | 'json'>(name: string, config?: MsSqlVarCharConfigInitial<TMode, T | Writable<T>>): Equal<TMode, 'json'> extends true ? MsSqlVarCharJsonBuilder : MsSqlVarCharBuilder<Writable<T>>;
//#endregion
export { MsSqlVarChar, MsSqlVarCharBuilder, MsSqlVarCharConfig, MsSqlVarCharConfigInitial, MsSqlVarCharJson, MsSqlVarCharJsonBuilder, nvarchar, varchar };
//# sourceMappingURL=varchar.d.ts.map