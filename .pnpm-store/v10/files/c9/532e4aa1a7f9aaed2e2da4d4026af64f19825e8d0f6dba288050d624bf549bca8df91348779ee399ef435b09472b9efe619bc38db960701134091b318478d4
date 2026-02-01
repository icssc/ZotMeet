import { MySqlStringBaseColumn, MySqlStringColumnBaseBuilder } from "./string.common.cjs";
import { entityKind } from "../../entity.cjs";
import { NonArray, Writable } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mysql-core/columns/enum.d.ts
declare class MySqlEnumColumnBuilder<TEnum extends [string, ...string[]]> extends MySqlStringColumnBaseBuilder<{
  dataType: 'string enum';
  data: TEnum[number];
  driverParam: string;
  enumValues: TEnum;
}, {
  enumValues: TEnum;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, values: TEnum);
}
declare class MySqlEnumColumn<T extends ColumnBaseConfig<'string enum'>> extends MySqlStringBaseColumn<T, {
  enumValues: T['enumValues'];
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"];
  getSQLType(): string;
}
declare class MySqlEnumObjectColumnBuilder<TEnum extends object> extends MySqlStringColumnBaseBuilder<{
  dataType: 'string enum';
  data: TEnum[keyof TEnum];
  driverParam: string;
  enumValues: string[];
}, {
  enumValues: TEnum;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, values: TEnum);
}
declare class MySqlEnumObjectColumn<T extends ColumnBaseConfig<'string enum'>> extends MySqlStringBaseColumn<T, {
  enumValues: T['enumValues'];
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"];
  getSQLType(): string;
}
declare function mysqlEnum<U extends string, T extends Readonly<[U, ...U[]]>>(values: T | Writable<T>): MySqlEnumColumnBuilder<Writable<T>>;
declare function mysqlEnum<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, values: T | Writable<T>): MySqlEnumColumnBuilder<Writable<T>>;
declare function mysqlEnum<E extends Record<string, string>>(enumObj: NonArray<E>): MySqlEnumObjectColumnBuilder<E>;
declare function mysqlEnum<E extends Record<string, string>>(name: string, values: NonArray<E>): MySqlEnumObjectColumnBuilder<E>;
//#endregion
export { MySqlEnumColumn, MySqlEnumColumnBuilder, MySqlEnumObjectColumn, MySqlEnumObjectColumnBuilder, mysqlEnum };
//# sourceMappingURL=enum.d.cts.map