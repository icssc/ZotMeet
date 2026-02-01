import { PgColumn, PgColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal, Writable } from "../../utils.cjs";
import { PgTable } from "../table.cjs";

//#region src/pg-core/columns/text.d.ts
type PgTextBuilderConfig<TEnum extends [string, ...string[]]> = Equal<TEnum, [string, ...string[]]> extends true ? {
  dataType: 'string';
  data: string;
  driverParam: string;
} : {
  dataType: 'string enum';
  data: TEnum[number];
  enumValues: TEnum;
  driverParam: string;
};
declare class PgTextBuilder<TEnum extends [string, ...string[]] = [string, ...string[]]> extends PgColumnBuilder<PgTextBuilderConfig<TEnum>, {
  enumValues: TEnum;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: PgTextConfig<TEnum>);
}
declare class PgText<TEnum extends [string, ...string[]] = [string, ...string[]]> extends PgColumn<Equal<TEnum, [string, ...string[]]> extends true ? 'string' : 'string enum'> {
  static readonly [entityKind]: string;
  readonly enumValues: string[] | undefined;
  constructor(table: PgTable<any>, config: any, enumValues?: string[]);
  getSQLType(): string;
}
interface PgTextConfig<TEnum extends readonly string[] | undefined = readonly string[] | undefined> {
  enum?: TEnum;
}
declare function text(): PgTextBuilder;
declare function text(name: string): PgTextBuilder;
declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(config: PgTextConfig<T | Writable<T>>): PgTextBuilder<Writable<T>>;
declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(name: string, config: PgTextConfig<T | Writable<T>>): PgTextBuilder<Writable<T>>;
//#endregion
export { PgText, PgTextBuilder, PgTextConfig, text };
//# sourceMappingURL=text.d.cts.map