import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/vector.d.ts
declare class SingleStoreVectorBuilder extends SingleStoreColumnBuilder<{
  dataType: 'array vector';
  data: Array<number>;
  driverParam: string | Buffer;
  isLengthExact: true;
}, {
  length: number;
  isLengthExact: true;
  elementType?: Exclude<ElementType, 'I64'>;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: SingleStoreVectorConfig);
}
declare class SingleStoreVector<T extends ColumnBaseConfig<'array vector'>> extends SingleStoreColumn<T, {
  length: number;
  elementType?: Exclude<ElementType, 'I64'>;
}> {
  static readonly [entityKind]: string;
  readonly elementType: Exclude<ElementType, 'I64'> | undefined;
  getSQLType(): string;
  mapToDriverValue(value: Array<number>): string;
  mapFromDriverValue(value: string | Buffer | Array<number>): Array<number>;
}
declare class SingleStoreBigIntVectorBuilder extends SingleStoreColumnBuilder<{
  dataType: 'array int64vector';
  data: Array<bigint>;
  driverParam: string | Buffer;
  isLengthExact: true;
}, {
  length: number;
  isLengthExact: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: SingleStoreVectorConfig);
}
declare class SingleStoreBigIntVector<T extends ColumnBaseConfig<'array int64vector'>> extends SingleStoreColumn<T, {
  length: number;
}> {
  static readonly [entityKind]: string;
  readonly elementType = "I64";
  getSQLType(): string;
  mapToDriverValue(value: Array<bigint>): string;
  mapFromDriverValue(value: string | Buffer | Array<bigint>): Array<bigint>;
}
type ElementType = 'I8' | 'I16' | 'I32' | 'I64' | 'F32' | 'F64';
interface SingleStoreVectorConfig<TType extends ElementType | undefined = ElementType | undefined> {
  dimensions: number;
  elementType?: TType;
}
declare function vector<TType extends ElementType | undefined>(config: SingleStoreVectorConfig<TType>): Equal<TType, 'I64'> extends true ? SingleStoreBigIntVectorBuilder : SingleStoreVectorBuilder;
declare function vector<TType extends ElementType | undefined>(name: string, config: SingleStoreVectorConfig<TType>): Equal<TType, 'I64'> extends true ? SingleStoreBigIntVectorBuilder : SingleStoreVectorBuilder;
//#endregion
export { SingleStoreBigIntVector, SingleStoreBigIntVectorBuilder, SingleStoreVector, SingleStoreVectorBuilder, SingleStoreVectorConfig, vector };
//# sourceMappingURL=vector.d.cts.map