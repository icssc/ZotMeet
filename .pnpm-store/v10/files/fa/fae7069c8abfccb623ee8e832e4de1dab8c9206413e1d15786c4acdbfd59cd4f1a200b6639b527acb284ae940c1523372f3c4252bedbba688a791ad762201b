import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mysql-core/columns/blob.d.ts
type MySqlBlobColumnType = 'tinyblob' | 'blob' | 'mediumblob' | 'longblob';
declare class MySqlStringBlobBuilder extends MySqlColumnBuilder<{
  dataType: 'string';
  data: string;
  driverParam: string;
}, {
  blobType: MySqlBlobColumnType;
  length: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, blobType: MySqlBlobColumnType);
}
declare class MySqlStringBlob<T extends ColumnBaseConfig<'string'>> extends MySqlColumn<T, {
  blobType: MySqlBlobColumnType;
}> {
  static readonly [entityKind]: string;
  readonly blobType: MySqlBlobColumnType;
  getSQLType(): string;
  mapFromDriverValue(value: Buffer | Uint8Array | ArrayBuffer | string): T['data'];
}
declare class MySqlBufferBlobBuilder extends MySqlColumnBuilder<{
  dataType: 'string';
  data: Buffer;
  driverParam: string;
}, {
  blobType: MySqlBlobColumnType;
  length: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, blobType: MySqlBlobColumnType);
}
declare class MySqlBufferBlob<T extends ColumnBaseConfig<'object buffer'>> extends MySqlColumn<T, {
  blobType: MySqlBlobColumnType;
}> {
  static readonly [entityKind]: string;
  readonly blobType: MySqlBlobColumnType;
  getSQLType(): string;
  mapFromDriverValue(value: Buffer | Uint8Array | ArrayBuffer | string): T['data'];
}
interface MySqlBlobConfig<TMode extends 'buffer' | 'string' = 'buffer' | 'string'> {
  mode?: TMode;
}
declare function blob<TMode extends MySqlBlobConfig['mode'] & {}>(config?: MySqlBlobConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlStringBlobBuilder : MySqlBufferBlobBuilder;
declare function blob<TMode extends MySqlBlobConfig['mode'] & {}>(name: string, config?: MySqlBlobConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlStringBlobBuilder : MySqlBufferBlobBuilder;
declare function tinyblob<TMode extends MySqlBlobConfig['mode'] & {}>(config?: MySqlBlobConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlStringBlobBuilder : MySqlBufferBlobBuilder;
declare function tinyblob<TMode extends MySqlBlobConfig['mode'] & {}>(name: string, config?: MySqlBlobConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlStringBlobBuilder : MySqlBufferBlobBuilder;
declare function mediumblob<TMode extends MySqlBlobConfig['mode'] & {}>(config?: MySqlBlobConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlStringBlobBuilder : MySqlBufferBlobBuilder;
declare function mediumblob<TMode extends MySqlBlobConfig['mode'] & {}>(name: string, config?: MySqlBlobConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlStringBlobBuilder : MySqlBufferBlobBuilder;
declare function longblob<TMode extends MySqlBlobConfig['mode'] & {}>(config?: MySqlBlobConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlStringBlobBuilder : MySqlBufferBlobBuilder;
declare function longblob<TMode extends MySqlBlobConfig['mode'] & {}>(name: string, config?: MySqlBlobConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlStringBlobBuilder : MySqlBufferBlobBuilder;
//#endregion
export { MySqlBlobColumnType, MySqlBlobConfig, MySqlBufferBlob, MySqlBufferBlobBuilder, MySqlStringBlob, MySqlStringBlobBuilder, blob, longblob, mediumblob, tinyblob };
//# sourceMappingURL=blob.d.cts.map