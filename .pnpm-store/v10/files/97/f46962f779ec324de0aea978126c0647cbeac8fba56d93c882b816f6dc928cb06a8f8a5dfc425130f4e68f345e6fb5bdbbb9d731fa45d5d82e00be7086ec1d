import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal, Writable } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/varchar.d.ts
declare class SingleStoreVarCharBuilder<TEnum extends [string, ...string[]]> extends SingleStoreColumnBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  driverParam: number | string;
  enumValues: TEnum;
}, SingleStoreVarCharConfig<TEnum>> {
  static readonly [entityKind]: string;
}
declare class SingleStoreVarChar<T extends ColumnBaseConfig<'string' | 'string enum'> & {
  length: number;
}> extends SingleStoreColumn<T, SingleStoreVarCharConfig<T['enumValues']>> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"] | undefined;
  getSQLType(): string;
}
interface SingleStoreVarCharConfig<TEnum extends string[] | readonly string[] | undefined = string[] | readonly string[] | undefined> {
  enum?: TEnum;
  length: number;
}
declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>>(config: SingleStoreVarCharConfig<T | Writable<T>>): SingleStoreVarCharBuilder<Writable<T>>;
declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config: SingleStoreVarCharConfig<T | Writable<T>>): SingleStoreVarCharBuilder<Writable<T>>;
//#endregion
export { SingleStoreVarChar, SingleStoreVarCharBuilder, SingleStoreVarCharConfig, varchar };
//# sourceMappingURL=varchar.d.cts.map