import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";

//#region src/mysql-core/columns/bigint.d.ts
declare class MySqlBigInt53Builder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number uint53' : 'number int53';
  data: number;
  driverParam: number | string;
}, {
  unsigned?: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, unsigned?: boolean);
}
declare class MySqlBigInt53<T extends ColumnBaseConfig<'number int53' | 'number uint53'>> extends MySqlColumnWithAutoIncrement<T, {
  unsigned: boolean;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare class MySqlBigInt64Builder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'bigint uint64' : 'bigint int64';
  data: bigint;
  driverParam: string;
}, {
  unsigned?: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, unsigned?: boolean);
}
declare class MySqlBigInt64<T extends ColumnBaseConfig<'bigint int64' | 'bigint uint64'>> extends MySqlColumnWithAutoIncrement<T, {
  unsigned: boolean;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapToDriverValue(value: bigint): string;
  mapFromDriverValue(value: bigint | string): bigint;
}
declare class MySqlBigIntStringBuilder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'string uint64' : 'string int64';
  data: string;
  driverParam: number | string;
}, {
  unsigned?: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, unsigned?: boolean);
}
declare class MySqlBigIntString<T extends ColumnBaseConfig<'string int64' | 'string uint64'>> extends MySqlColumnWithAutoIncrement<T, {
  unsigned: boolean;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): string;
}
interface MySqlBigIntConfig<T extends 'number' | 'bigint' | 'string' = 'number' | 'bigint' | 'string', TUnsigned extends boolean | undefined = boolean | undefined> {
  mode: T;
  unsigned?: TUnsigned;
}
declare function bigint<TMode extends MySqlBigIntConfig['mode'], TUnsigned extends boolean | undefined>(config: MySqlBigIntConfig<TMode, TUnsigned>): TMode extends 'bigint' ? MySqlBigInt64Builder<TUnsigned> : TMode extends 'string' ? MySqlBigIntStringBuilder<TUnsigned> : MySqlBigInt53Builder<TUnsigned>;
declare function bigint<TMode extends MySqlBigIntConfig['mode'], TUnsigned extends boolean | undefined>(name: string, config: MySqlBigIntConfig<TMode, TUnsigned>): TMode extends 'bigint' ? MySqlBigInt64Builder<TUnsigned> : TMode extends 'string' ? MySqlBigIntStringBuilder<TUnsigned> : MySqlBigInt53Builder<TUnsigned>;
//#endregion
export { MySqlBigInt53, MySqlBigInt53Builder, MySqlBigInt64, MySqlBigInt64Builder, MySqlBigIntConfig, MySqlBigIntString, MySqlBigIntStringBuilder, bigint };
//# sourceMappingURL=bigint.d.ts.map