import { TursoDatabaseRunResult } from "./driver-core.js";
import { entityKind } from "../entity.js";
import { Query, SQL } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { Cache } from "../cache/core/index.js";
import { SQLiteAsyncDialect } from "../sqlite-core/dialect.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import { PreparedQueryConfig as PreparedQueryConfig$1, Result, SQLiteExecuteMethod as SQLiteExecuteMethod$1, SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1, SQLiteTransactionConfig as SQLiteTransactionConfig$1 } from "../sqlite-core/session.js";
import { AnyRelations } from "../relations.js";
import { WithCacheConfig } from "../cache/core/types.js";
import { SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../sqlite-core/query-builders/select.types.js";
import { DatabasePromise } from "@tursodatabase/database-common";

//#region src/tursodatabase/session.d.ts
interface TursoDatabaseSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
type PreparedQueryConfig$2 = Omit<PreparedQueryConfig$1, 'statement' | 'run'>;
declare class TursoDatabaseSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteSession$1<'async', TursoDatabaseRunResult, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: DatabasePromise, dialect: SQLiteAsyncDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options: TursoDatabaseSessionOptions);
  prepareQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): TursoDatabasePreparedQuery<T>;
  prepareRelationalQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, customResultMapper: (rows: Record<string, unknown>[]) => unknown): TursoDatabasePreparedQuery<T, true>;
  transaction<T>(transaction: (db: TursoDatabaseTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, _config?: SQLiteTransactionConfig$1, tx?: TursoDatabaseTransaction<TFullSchema, TRelations, TSchema>): Promise<T>;
  run(query: SQL): Result<'async', TursoDatabaseRunResult>;
  all<T = unknown>(query: SQL): Result<'async', T[]>;
  get<T = unknown>(query: SQL): Result<'async', T>;
  values<T extends any[] = unknown[]>(query: SQL): Result<'async', T[]>;
}
declare class TursoDatabaseTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteTransaction<'async', TursoDatabaseRunResult, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(_transaction: (tx: TursoDatabaseTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare class TursoDatabasePreparedQuery<T extends PreparedQueryConfig$2 = PreparedQueryConfig$2, TIsRqbV2 extends boolean = false> extends SQLitePreparedQuery$1<{
  type: 'async';
  run: TursoDatabaseRunResult;
  all: T['all'];
  get: T['get'];
  values: T['values'];
  execute: T['execute'];
}> {
  private stmt;
  private logger;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(stmt: ReturnType<DatabasePromise['prepare']>, query: Query, logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, /** @internal */fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  run(placeholderValues?: Record<string, unknown>): Promise<TursoDatabaseRunResult>;
  all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
  private allRqbV2;
  get(placeholderValues?: Record<string, unknown>): Promise<T['get']>;
  private getRqbV2;
  values(placeholderValues?: Record<string, unknown>): Promise<T['values']>;
}
//#endregion
export { TursoDatabasePreparedQuery, TursoDatabaseSession, TursoDatabaseSessionOptions, TursoDatabaseTransaction };
//# sourceMappingURL=session.d.ts.map