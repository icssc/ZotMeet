import { SQLiteColumn, SQLiteColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/sqlite-core/columns/blob.d.ts
type BlobMode = 'buffer' | 'json' | 'bigint';
declare class SQLiteBigIntBuilder extends SQLiteColumnBuilder<{
  dataType: 'bigint int64';
  data: bigint;
  driverParam: Buffer;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SQLiteBigInt<T extends ColumnBaseConfig<'bigint int64'>> extends SQLiteColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: Buffer | Uint8Array | ArrayBuffer | string): bigint;
  mapToDriverValue(value: bigint): Buffer;
}
declare class SQLiteBlobJsonBuilder extends SQLiteColumnBuilder<{
  dataType: 'object json';
  data: unknown;
  driverParam: Buffer;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SQLiteBlobJson<T extends ColumnBaseConfig<'object json'>> extends SQLiteColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: Buffer | Uint8Array | ArrayBuffer | string): T['data'];
  mapToDriverValue(value: T['data']): Buffer;
}
declare class SQLiteBlobBufferBuilder extends SQLiteColumnBuilder<{
  dataType: 'object buffer';
  data: Buffer;
  driverParam: Buffer;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SQLiteBlobBuffer<T extends ColumnBaseConfig<'object buffer'>> extends SQLiteColumn<T> {
  static readonly [entityKind]: string;
  mapFromDriverValue(value: Buffer | Uint8Array | ArrayBuffer): T['data'];
  getSQLType(): string;
}
interface BlobConfig<TMode extends BlobMode = BlobMode> {
  mode: TMode;
}
/**
 *  It's recommended to use `text('...', { mode: 'json' })` instead of `blob` in JSON mode, because it supports JSON functions:
 * >All JSON functions currently throw an error if any of their arguments are BLOBs because BLOBs are reserved for a future enhancement in which BLOBs will store the binary encoding for JSON.
 *
 * https://www.sqlite.org/json1.html
 */
declare function blob<TMode extends BlobMode = BlobMode>(config?: BlobConfig<TMode>): Equal<TMode, 'bigint'> extends true ? SQLiteBigIntBuilder : Equal<TMode, 'buffer'> extends true ? SQLiteBlobBufferBuilder : SQLiteBlobJsonBuilder;
declare function blob<TMode extends BlobMode = BlobMode>(name: string, config?: BlobConfig<TMode>): Equal<TMode, 'bigint'> extends true ? SQLiteBigIntBuilder : Equal<TMode, 'buffer'> extends true ? SQLiteBlobBufferBuilder : SQLiteBlobJsonBuilder;
//#endregion
export { BlobConfig, SQLiteBigInt, SQLiteBigIntBuilder, SQLiteBlobBuffer, SQLiteBlobBufferBuilder, SQLiteBlobJson, SQLiteBlobJsonBuilder, blob };
//# sourceMappingURL=blob.d.cts.map