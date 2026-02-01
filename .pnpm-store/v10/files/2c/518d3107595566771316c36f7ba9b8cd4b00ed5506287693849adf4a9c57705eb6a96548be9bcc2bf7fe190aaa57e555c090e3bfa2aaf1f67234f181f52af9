import { entityKind } from "../entity.cjs";
import { Query } from "../sql/sql.cjs";
import * as V1 from "../_relations.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";
import { AnyRelations } from "../relations.cjs";
import { SQLiteAsyncDialect } from "../sqlite-core/dialect.cjs";
import { PreparedQueryConfig, SQLiteExecuteMethod, SQLitePreparedQuery, SQLiteSession, SQLiteTransactionConfig } from "../sqlite-core/session.cjs";
import { Logger } from "../logger.cjs";
import { Cache } from "../cache/core/index.cjs";
import { SQLiteTransaction as SQLiteTransaction$1 } from "../sqlite-core/index.cjs";
import { SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../sqlite-core/query-builders/select.types.cjs";
import { BatchItem } from "../batch.cjs";
import { Client, ResultSet, Transaction } from "@libsql/client";

//#region src/libsql/session.d.ts
interface LibSQLSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
type PreparedQueryConfig$2 = Omit<PreparedQueryConfig, 'statement' | 'run'>;
declare class LibSQLSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteSession<'async', ResultSet, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  private tx;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: Client, dialect: SQLiteAsyncDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options: LibSQLSessionOptions, tx: Transaction | undefined);
  prepareQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): LibSQLPreparedQuery<T>;
  prepareRelationalQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, customResultMapper: (rows: Record<string, unknown>[]) => unknown): LibSQLPreparedQuery<T, true>;
  batch<T extends BatchItem<'sqlite'>[] | readonly BatchItem<'sqlite'>[]>(queries: T): Promise<unknown[]>;
  migrate<T extends BatchItem<'sqlite'>[] | readonly BatchItem<'sqlite'>[]>(queries: T): Promise<unknown[]>;
  transaction<T>(transaction: (db: LibSQLTransaction<TFullSchema, TRelations, TSchema>) => T | Promise<T>, _config?: SQLiteTransactionConfig): Promise<T>;
  extractRawAllValueFromBatchResult(result: unknown): unknown;
  extractRawGetValueFromBatchResult(result: unknown): unknown;
  extractRawValuesValueFromBatchResult(result: unknown): unknown;
}
declare class LibSQLTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteTransaction$1<'async', ResultSet, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: LibSQLTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare class LibSQLPreparedQuery<T extends PreparedQueryConfig$2 = PreparedQueryConfig$2, TIsRqbV2 extends boolean = false> extends SQLitePreparedQuery<{
  type: 'async';
  run: ResultSet;
  all: T['all'];
  get: T['get'];
  values: T['values'];
  execute: T['execute'];
}> {
  private client;
  private logger;
  private tx;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: Client, query: Query, logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, /** @internal */fields: SelectedFieldsOrdered$1 | undefined, tx: Transaction | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  run(placeholderValues?: Record<string, unknown>): Promise<ResultSet>;
  all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
  private allRqbV2;
  mapAllResult(rows: unknown, isFromBatch?: boolean): unknown;
  get(placeholderValues?: Record<string, unknown>): Promise<T['get']>;
  private getRqbV2;
  mapGetResult(rows: unknown, isFromBatch?: boolean): unknown;
  values(placeholderValues?: Record<string, unknown>): Promise<T['values']>;
}
//#endregion
export { LibSQLPreparedQuery, LibSQLSession, LibSQLSessionOptions, LibSQLTransaction };
//# sourceMappingURL=session.d.cts.map