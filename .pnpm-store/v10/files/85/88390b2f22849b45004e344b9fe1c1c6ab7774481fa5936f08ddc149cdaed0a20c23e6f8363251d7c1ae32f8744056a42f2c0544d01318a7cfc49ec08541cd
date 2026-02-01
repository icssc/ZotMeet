import { entityKind } from "../entity.js";
import { Query } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { Cache } from "../cache/core/index.js";
import { SQLiteAsyncDialect } from "../sqlite-core/dialect.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import { PreparedQueryConfig as PreparedQueryConfig$1, SQLiteExecuteMethod as SQLiteExecuteMethod$1, SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1, SQLiteTransactionConfig as SQLiteTransactionConfig$1 } from "../sqlite-core/session.js";
import { AnyRelations } from "../relations.js";
import { WithCacheConfig } from "../cache/core/types.js";
import { SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../sqlite-core/query-builders/select.types.js";
import { BatchItem } from "../batch.js";

//#region src/d1/session.d.ts
interface SQLiteD1SessionOptions {
  logger?: Logger;
  cache?: Cache;
}
type PreparedQueryConfig$2 = Omit<PreparedQueryConfig$1, 'statement' | 'run'>;
declare class SQLiteD1Session<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteSession$1<'async', D1Result, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: D1Database | D1DatabaseSession, dialect: SQLiteAsyncDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: SQLiteD1SessionOptions);
  prepareQuery(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): D1PreparedQuery;
  prepareRelationalQuery(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, customResultMapper?: (rows: Record<string, unknown>[]) => unknown): D1PreparedQuery<PreparedQueryConfig$2, true>;
  batch<T extends BatchItem<'sqlite'>[] | readonly BatchItem<'sqlite'>[]>(queries: T): Promise<unknown[]>;
  extractRawAllValueFromBatchResult(result: unknown): unknown;
  extractRawGetValueFromBatchResult(result: unknown): unknown;
  extractRawValuesValueFromBatchResult(result: unknown): unknown;
  transaction<T>(transaction: (tx: D1Transaction<TFullSchema, TRelations, TSchema>) => T | Promise<T>, config?: SQLiteTransactionConfig$1): Promise<T>;
}
declare class D1Transaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteTransaction<'async', D1Result, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: D1Transaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare class D1PreparedQuery<T extends PreparedQueryConfig$2 = PreparedQueryConfig$2, TIsRqbV2 extends boolean = false> extends SQLitePreparedQuery$1<{
  type: 'async';
  run: D1Response;
  all: T['all'];
  get: T['get'];
  values: T['values'];
  execute: T['execute'];
}> {
  private logger;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(stmt: D1PreparedStatement, query: Query, logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => unknown) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  run(placeholderValues?: Record<string, unknown>): Promise<D1Response>;
  all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
  private allRqbV2;
  mapAllResult(rows: unknown, isFromBatch?: boolean): unknown;
  get(placeholderValues?: Record<string, unknown>): Promise<T['get']>;
  private getRqbV2;
  mapGetResult(result: unknown, isFromBatch?: boolean): unknown;
  values<T extends any[] = unknown[]>(placeholderValues?: Record<string, unknown>): Promise<T[]>;
}
//#endregion
export { D1PreparedQuery, D1Transaction, SQLiteD1Session, SQLiteD1SessionOptions };
//# sourceMappingURL=session.d.ts.map