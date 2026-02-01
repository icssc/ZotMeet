import { SingleStoreColumn, SingleStoreColumnBuilder, SingleStoreGeneratedColumnConfig } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Writable } from "../../utils.js";
import { HasGenerated } from "../../column-builder.js";
import { SQL } from "../../sql/index.js";

//#region src/singlestore-core/columns/enum.d.ts
declare class SingleStoreEnumColumnBuilder<TEnum extends [string, ...string[]]> extends SingleStoreColumnBuilder<{
  dataType: 'string enum';
  data: TEnum[number];
  driverParam: string;
  enumValues: TEnum;
}, {
  enumValues: TEnum;
}> {
  generatedAlwaysAs(as: SQL<unknown> | (() => SQL) | TEnum[number], config?: SingleStoreGeneratedColumnConfig): HasGenerated<this, {
    type: 'always';
  }>;
  static readonly [entityKind]: string;
  constructor(name: string, values: TEnum);
}
declare class SingleStoreEnumColumn<T extends ColumnBaseConfig<'string enum'>> extends SingleStoreColumn<T, {
  enumValues: T['enumValues'];
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"];
  getSQLType(): string;
}
declare function singlestoreEnum<U extends string, T extends Readonly<[U, ...U[]]>>(values: T | Writable<T>): SingleStoreEnumColumnBuilder<Writable<T>>;
declare function singlestoreEnum<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, values: T | Writable<T>): SingleStoreEnumColumnBuilder<Writable<T>>;
//#endregion
export { SingleStoreEnumColumn, SingleStoreEnumColumnBuilder, singlestoreEnum };
//# sourceMappingURL=enum.d.ts.map