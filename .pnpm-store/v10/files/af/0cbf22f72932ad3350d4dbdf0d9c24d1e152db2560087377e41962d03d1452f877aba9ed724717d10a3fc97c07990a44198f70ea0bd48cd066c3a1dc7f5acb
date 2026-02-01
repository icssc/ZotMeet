import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { AnyRelations, EmptyRelations } from "../relations.js";
import { BatchItem, BatchResponse } from "../batch.js";

//#region src/sqlite-proxy/driver.d.ts
interface SqliteRemoteResult<T = unknown> {
  rows?: T[];
}
declare class SqliteRemoteDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'async', SqliteRemoteResult, TSchema, TRelations> {
  static readonly [entityKind]: string;
  batch<U extends BatchItem<'sqlite'>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>;
}
type AsyncRemoteCallback = (sql: string, params: any[], method: 'run' | 'all' | 'values' | 'get') => Promise<{
  rows: any[];
}>;
type AsyncBatchRemoteCallback = (batch: {
  sql: string;
  params: any[];
  method: 'run' | 'all' | 'values' | 'get';
}[]) => Promise<{
  rows: any[];
}[]>;
type RemoteCallback = AsyncRemoteCallback;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(callback: RemoteCallback, config?: DrizzleConfig<TSchema, TRelations>): SqliteRemoteDatabase<TSchema, TRelations>;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(callback: RemoteCallback, batchCallback?: AsyncBatchRemoteCallback, config?: DrizzleConfig<TSchema, TRelations>): SqliteRemoteDatabase<TSchema, TRelations>;
//#endregion
export { AsyncBatchRemoteCallback, AsyncRemoteCallback, RemoteCallback, SqliteRemoteDatabase, SqliteRemoteResult, drizzle };
//# sourceMappingURL=driver.d.ts.map