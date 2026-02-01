import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/bigint.d.ts
declare class SingleStoreBigInt53Builder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number uint53' : 'number int53';
  data: number;
  driverParam: number | string;
}, {
  unsigned: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, unsigned?: boolean);
}
declare class SingleStoreBigInt53<T extends ColumnBaseConfig<'number int53' | 'number uint53'>> extends SingleStoreColumnWithAutoIncrement<T, {
  unsigned: boolean;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare class SingleStoreBigInt64Builder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'bigint uint64' : 'bigint int64';
  data: bigint;
  driverParam: string;
}, {
  unsigned: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, unsigned?: boolean);
}
declare class SingleStoreBigInt64<T extends ColumnBaseConfig<'bigint int64' | 'bigint uint64'>> extends SingleStoreColumnWithAutoIncrement<T, {
  unsigned: boolean;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string): bigint;
}
declare class SingleStoreBigIntStringBuilder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'string uint64' : 'string int64';
  data: string;
  driverParam: string;
}, {
  unsigned: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, unsigned?: boolean);
}
declare class SingleStoreBigIntString<T extends ColumnBaseConfig<'string int64' | 'string uint64'>> extends SingleStoreColumnWithAutoIncrement<T, {
  unsigned: boolean;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
interface SingleStoreBigIntConfig<T extends 'number' | 'bigint' | 'string' = 'number' | 'bigint' | 'string', TUnsigned extends boolean | undefined = boolean | undefined> {
  mode: T;
  unsigned?: TUnsigned;
}
declare function bigint<TMode extends SingleStoreBigIntConfig['mode'], TUnsigned extends boolean | undefined>(config: SingleStoreBigIntConfig<TMode, TUnsigned>): TMode extends 'string' ? SingleStoreBigIntStringBuilder<TUnsigned> : TMode extends 'bigint' ? SingleStoreBigInt64Builder<TUnsigned> : SingleStoreBigInt53Builder<TUnsigned>;
declare function bigint<TMode extends SingleStoreBigIntConfig['mode'], TUnsigned extends boolean | undefined>(name: string, config: SingleStoreBigIntConfig<TMode, TUnsigned>): TMode extends 'string' ? SingleStoreBigIntStringBuilder<TUnsigned> : TMode extends 'bigint' ? SingleStoreBigInt64Builder<TUnsigned> : SingleStoreBigInt53Builder<TUnsigned>;
//#endregion
export { SingleStoreBigInt53, SingleStoreBigInt53Builder, SingleStoreBigInt64, SingleStoreBigInt64Builder, SingleStoreBigIntConfig, SingleStoreBigIntString, SingleStoreBigIntStringBuilder, bigint };
//# sourceMappingURL=bigint.d.cts.map