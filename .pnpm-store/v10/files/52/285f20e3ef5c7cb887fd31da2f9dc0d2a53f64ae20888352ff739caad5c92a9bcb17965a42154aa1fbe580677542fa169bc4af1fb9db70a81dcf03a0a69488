import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal, Writable } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/varchar.d.ts
declare class CockroachVarcharBuilder<TEnum extends [string, ...string[]]> extends CockroachColumnWithArrayBuilder<{
  dataType: Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum';
  data: TEnum[number];
  driverParam: string;
  enumValues: TEnum;
}, {
  length: number | undefined;
  enumValues: TEnum | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: CockroachVarcharConfig<TEnum>);
}
declare class CockroachVarchar<T extends ColumnBaseConfig<'string' | 'string enum'>> extends CockroachColumn<T, {
  length: number | undefined;
  enumValues: T['enumValues'];
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"];
  getSQLType(): string;
}
interface CockroachVarcharConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
  enum?: TEnum;
  length?: number | undefined;
}
declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>>(config?: CockroachVarcharConfig<T | Writable<T>>): CockroachVarcharBuilder<Writable<T>>;
declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config?: CockroachVarcharConfig<T | Writable<T>>): CockroachVarcharBuilder<Writable<T>>;
//#endregion
export { CockroachVarchar, CockroachVarcharBuilder, CockroachVarcharConfig, varchar };
//# sourceMappingURL=varchar.d.cts.map