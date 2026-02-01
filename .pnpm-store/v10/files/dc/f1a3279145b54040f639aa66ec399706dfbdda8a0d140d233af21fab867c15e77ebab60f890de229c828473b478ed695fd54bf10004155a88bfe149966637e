import { entityKind } from "../../entity.js";
import { Query, SQL } from "../../sql/sql.js";
import * as V1 from "../../_relations.js";
import { Logger } from "../../logger.js";
import { Cache } from "../../cache/core/index.js";
import { SQLiteAsyncDialect } from "../../sqlite-core/dialect.js";
import { SQLiteTransaction } from "../../sqlite-core/index.js";
import { PreparedQueryConfig as PreparedQueryConfig$1, Result, SQLiteExecuteMethod as SQLiteExecuteMethod$1, SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1, SQLiteTransactionConfig as SQLiteTransactionConfig$1 } from "../../sqlite-core/session.js";
import { AnyRelations } from "../../relations.js";
import { SQL as SQL$1 } from "bun";
import { WithCacheConfig } from "../../cache/core/types.js";
import { SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../../sqlite-core/query-builders/select.types.js";

//#region src/bun-sql/sqlite/session.d.ts
interface BunSQLiteSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
type BunSQLiteRunResult = Record<string, unknown>[] & Record<string, unknown>;
type PreparedQueryConfig$2 = Omit<PreparedQueryConfig$1, 'statement' | 'run'>;
declare class BunSQLiteSession<TSQL extends SQL$1, TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteSession$1<'async', BunSQLiteRunResult, TFullSchema, TRelations, TSchema> {
  readonly client: TSQL;
  private relations;
  private schema;
  readonly options: BunSQLiteSessionOptions;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: TSQL, dialect: SQLiteAsyncDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options: BunSQLiteSessionOptions);
  prepareQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): BunSQLitePreparedQuery<T>;
  prepareRelationalQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, customResultMapper: (rows: Record<string, unknown>[]) => unknown): BunSQLitePreparedQuery<T, true>;
  run(query: SQL): Result<'async', BunSQLiteRunResult>;
  transaction<T>(transaction: (db: BunSQLiteTransaction<TFullSchema, TRelations, TSchema>) => T | Promise<T>, config?: SQLiteTransactionConfig$1): Promise<T>;
}
declare class BunSQLiteTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteTransaction<'async', BunSQLiteRunResult, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: BunSQLiteTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare class BunSQLitePreparedQuery<T extends PreparedQueryConfig$2 = PreparedQueryConfig$2, TIsRqbV2 extends boolean = false> extends SQLitePreparedQuery$1<{
  type: 'async';
  run: BunSQLiteRunResult;
  all: T['all'];
  get: T['get'];
  values: T['values'];
  execute: T['execute'];
}> {
  private client;
  private logger;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: SQL$1, query: Query, logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, /** @internal */fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  run(placeholderValues?: Record<string, unknown>): Promise<BunSQLiteRunResult>;
  all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
  private allRqbV2;
  get(placeholderValues?: Record<string, unknown>): Promise<T['get']>;
  private getRqbV2;
  values(placeholderValues?: Record<string, unknown>): Promise<T['values']>;
}
//#endregion
export { BunSQLitePreparedQuery, BunSQLiteRunResult, BunSQLiteSession, BunSQLiteSessionOptions, BunSQLiteTransaction };
//# sourceMappingURL=session.d.ts.map