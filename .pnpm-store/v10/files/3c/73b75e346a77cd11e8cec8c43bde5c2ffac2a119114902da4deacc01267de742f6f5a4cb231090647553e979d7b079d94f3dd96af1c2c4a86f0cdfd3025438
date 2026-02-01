import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal, Writable } from "../../utils.js";

//#region src/singlestore-core/columns/char.d.ts
declare class SingleStoreCharBuilder<TEnum extends [string, ...string[]]> extends SingleStoreColumnBuilder<{
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
  constructor(name: string, config: SingleStoreCharConfig<TEnum>);
}
declare class SingleStoreChar<T extends ColumnBaseConfig<'string' | 'string enum'>> extends SingleStoreColumn<T, {
  enum?: T['enumValues'];
  length: number;
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"] | undefined;
  getSQLType(): string;
}
interface SingleStoreCharConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
  enum?: TEnum;
  length?: number;
}
declare function char<U extends string, T extends Readonly<[U, ...U[]]>>(config?: SingleStoreCharConfig<T | Writable<T>>): SingleStoreCharBuilder<Writable<T>>;
declare function char<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: SingleStoreCharConfig<T | Writable<T>>): SingleStoreCharBuilder<Writable<T>>;
//#endregion
export { SingleStoreChar, SingleStoreCharBuilder, SingleStoreCharConfig, char };
//# sourceMappingURL=char.d.ts.map