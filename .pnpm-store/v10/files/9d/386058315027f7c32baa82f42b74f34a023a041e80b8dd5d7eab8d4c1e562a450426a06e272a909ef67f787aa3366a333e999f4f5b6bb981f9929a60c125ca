import { AsyncBatchRemoteCallback, RemoteCallback, SqliteRemoteResult } from "./driver.cjs";
import { entityKind } from "../entity.cjs";
import { Query } from "../sql/sql.cjs";
import * as V1 from "../_relations.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";
import { AnyRelations } from "../relations.cjs";
import { SQLiteAsyncDialect } from "../sqlite-core/dialect.cjs";
import { PreparedQueryConfig as PreparedQueryConfig$1, SQLiteExecuteMethod, SQLitePreparedQuery, SQLiteSession, SQLiteTransactionConfig } from "../sqlite-core/session.cjs";
import { Logger } from "../logger.cjs";
import { Cache } from "../cache/core/index.cjs";
import { SQLiteTransaction as SQLiteTransaction$1 } from "../sqlite-core/index.cjs";
import { SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../sqlite-core/query-builders/select.types.cjs";
import { BatchItem } from "../batch.cjs";

//#region src/sqlite-proxy/session.d.ts
interface SQLiteRemoteSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
type PreparedQueryConfig = Omit<PreparedQueryConfig$1, 'statement' | 'run'>;
declare class SQLiteRemoteSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteSession<'async', SqliteRemoteResult, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private batchCLient?;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: RemoteCallback, dialect: SQLiteAsyncDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, batchCLient?: AsyncBatchRemoteCallback | undefined, options?: SQLiteRemoteSessionOptions);
  prepareQuery<T extends Omit<PreparedQueryConfig, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): RemotePreparedQuery<T>;
  prepareRelationalQuery<T extends Omit<PreparedQueryConfig, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, customResultMapper: (rows: Record<string, unknown>[]) => unknown): RemotePreparedQuery<T, true>;
  batch<T extends BatchItem<'sqlite'>[] | readonly BatchItem<'sqlite'>[]>(queries: T): Promise<unknown[]>;
  transaction<T>(transaction: (tx: SQLiteProxyTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, config?: SQLiteTransactionConfig): Promise<T>;
  extractRawAllValueFromBatchResult(result: unknown): unknown;
  extractRawGetValueFromBatchResult(result: unknown): unknown;
  extractRawValuesValueFromBatchResult(result: unknown): unknown;
}
declare class SQLiteProxyTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteTransaction$1<'async', SqliteRemoteResult, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: SQLiteProxyTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare class RemotePreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig, TIsRqbV2 extends boolean = false> extends SQLitePreparedQuery<{
  type: 'async';
  run: SqliteRemoteResult;
  all: T['all'];
  get: T['get'];
  values: T['values'];
  execute: T['execute'];
}> {
  private client;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  private method;
  constructor(client: RemoteCallback, query: Query, logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, /** @internal */customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => unknown) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  getQuery(): Query & {
    method: SQLiteExecuteMethod;
  };
  run(placeholderValues?: Record<string, unknown>): Promise<SqliteRemoteResult>;
  mapAllResult(rows: unknown, isFromBatch?: boolean): unknown;
  all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
  get(placeholderValues?: Record<string, unknown>): Promise<T['get']>;
  private allRqbV2;
  private getRqbV2;
  mapGetResult(rows: unknown, isFromBatch?: boolean): unknown;
  values<T extends any[] = unknown[]>(placeholderValues?: Record<string, unknown>): Promise<T[]>;
}
//#endregion
export { PreparedQueryConfig, RemotePreparedQuery, SQLiteProxyTransaction, SQLiteRemoteSession, SQLiteRemoteSessionOptions };
//# sourceMappingURL=session.d.cts.map