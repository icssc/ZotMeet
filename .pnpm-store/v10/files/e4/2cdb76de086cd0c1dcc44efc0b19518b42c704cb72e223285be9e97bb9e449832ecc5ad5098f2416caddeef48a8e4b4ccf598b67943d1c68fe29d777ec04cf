import { SQLiteColumn, SQLiteColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Assume, Equal, Writable } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { AnySQLiteTable } from "../table.cjs";

//#region src/sqlite-core/columns/text.d.ts
declare class SQLiteTextBuilder<TEnum extends [string, ...string[]]> extends SQLiteColumnBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  driverParam: string;
  enumValues: TEnum;
}, {
  enumValues: TEnum;
  length: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: SQLiteTextConfig<'text', TEnum>);
}
declare class SQLiteText<T extends ColumnBaseConfig<'string' | 'string enum'>> extends SQLiteColumn<T, {
  length: number | undefined;
  enumValues: T['enumValues'];
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"];
  constructor(table: AnySQLiteTable<{
    name: T['tableName'];
  }>, config: SQLiteTextBuilder<Assume<T['enumValues'], [string, ...string[]]>>['config']);
  getSQLType(): string;
}
declare class SQLiteTextJsonBuilder extends SQLiteColumnBuilder<{
  dataType: 'object json';
  data: unknown;
  driverParam: string;
  generated: undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SQLiteTextJson<T extends ColumnBaseConfig<'object json'>> extends SQLiteColumn<T, {
  length: number | undefined;
  enumValues: T['enumValues'];
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string): T['data'];
  mapToDriverValue(value: T['data']): string;
}
type SQLiteTextConfig<TMode extends 'text' | 'json' = 'text' | 'json', TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> = TMode extends 'text' ? {
  mode?: TMode;
  length?: number;
  enum?: TEnum;
} : {
  mode?: TMode;
};
declare function text<U extends string, T extends Readonly<[U, ...U[]]>, TMode extends 'text' | 'json' = 'text' | 'json'>(config?: SQLiteTextConfig<TMode, T | Writable<T>>): Equal<TMode, 'json'> extends true ? SQLiteTextJsonBuilder : SQLiteTextBuilder<Writable<T>>;
declare function text<U extends string, T extends Readonly<[U, ...U[]]>, TMode extends 'text' | 'json' = 'text' | 'json'>(name: string, config?: SQLiteTextConfig<TMode, T | Writable<T>>): Equal<TMode, 'json'> extends true ? SQLiteTextJsonBuilder : SQLiteTextBuilder<Writable<T>>;
//#endregion
export { SQLiteText, SQLiteTextBuilder, SQLiteTextConfig, SQLiteTextJson, SQLiteTextJsonBuilder, text };
//# sourceMappingURL=text.d.cts.map