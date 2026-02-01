import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal, Writable } from "../../utils.js";

//#region src/cockroach-core/columns/char.d.ts
declare class CockroachCharBuilder<TEnum extends [string, ...string[]]> extends CockroachColumnWithArrayBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  enumValues: TEnum;
  driverParam: string;
}, {
  enumValues: TEnum | undefined;
  length: number;
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: CockroachCharConfig<TEnum>);
}
declare class CockroachChar<T extends ColumnBaseConfig<'string' | 'string enum'>> extends CockroachColumn<T, {
  enumValues: T['enumValues'];
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"];
  getSQLType(): string;
}
interface CockroachCharConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
  enum?: TEnum;
  length?: number | undefined;
}
declare function char<U extends string, T extends Readonly<[U, ...U[]]>>(config?: CockroachCharConfig<T | Writable<T>>): CockroachCharBuilder<Writable<T>>;
declare function char<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: CockroachCharConfig<T | Writable<T>>): CockroachCharBuilder<Writable<T>>;
//#endregion
export { CockroachChar, CockroachCharBuilder, CockroachCharConfig, char };
//# sourceMappingURL=char.d.ts.map