import { BaseSQLiteDatabase } from "./db.cjs";
import { SQLiteRaw } from "./query-builders/raw.cjs";
import { SelectedFieldsOrdered } from "./query-builders/select.types.cjs";
import { entityKind } from "../entity.cjs";
import { Query, SQL } from "../sql/sql.cjs";
import * as V1 from "../_relations.cjs";
import { PreparedQuery } from "../session.cjs";
import { QueryPromise } from "../query-promise.cjs";
import { Cache } from "../cache/core/cache.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { SQLiteAsyncDialect, SQLiteSyncDialect } from "./dialect.cjs";

//#region src/sqlite-core/session.d.ts
interface PreparedQueryConfig {
  type: 'sync' | 'async';
  run: unknown;
  all: unknown;
  get: unknown;
  values: unknown;
  execute: unknown;
}
declare class ExecuteResultSync<T> extends QueryPromise<T> {
  private resultCb;
  static readonly [entityKind]: string;
  constructor(resultCb: () => T);
  execute(): Promise<T>;
  sync(): T;
}
type ExecuteResult<TType extends 'sync' | 'async', TResult> = TType extends 'async' ? Promise<TResult> : ExecuteResultSync<TResult>;
declare abstract class SQLitePreparedQuery<T extends PreparedQueryConfig> implements PreparedQuery {
  private mode;
  private executeMethod;
  protected query: Query;
  private cache?;
  private queryMetadata?;
  private cacheConfig?;
  static readonly [entityKind]: string;
  constructor(mode: 'sync' | 'async', executeMethod: SQLiteExecuteMethod, query: Query, cache?: Cache | undefined, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig?: WithCacheConfig | undefined);
  getQuery(): Query;
  abstract run(placeholderValues?: Record<string, unknown>): Result<T['type'], T['run']>;
  mapRunResult(result: unknown, _isFromBatch?: boolean): unknown;
  abstract all(placeholderValues?: Record<string, unknown>): Result<T['type'], T['all']>;
  mapAllResult(_result: unknown, _isFromBatch?: boolean): unknown;
  abstract get(placeholderValues?: Record<string, unknown>): Result<T['type'], T['get']>;
  mapGetResult(_result: unknown, _isFromBatch?: boolean): unknown;
  abstract values(placeholderValues?: Record<string, unknown>): Result<T['type'], T['values']>;
  execute(placeholderValues?: Record<string, unknown>): ExecuteResult<T['type'], T['execute']>;
  mapResult(response: unknown, isFromBatch?: boolean): unknown;
}
interface SQLiteTransactionConfig {
  behavior?: 'deferred' | 'immediate' | 'exclusive';
}
type SQLiteExecuteMethod = 'run' | 'all' | 'get';
declare abstract class SQLiteSession<TResultKind extends 'sync' | 'async', TRunResult, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = V1.ExtractTablesWithRelations<TFullSchema>> {
  static readonly [entityKind]: string;
  constructor(/** @internal */
  dialect: {
    sync: SQLiteSyncDialect;
    async: SQLiteAsyncDialect;
  }[TResultKind]);
  abstract prepareQuery(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): SQLitePreparedQuery<PreparedQueryConfig & {
    type: TResultKind;
  }>;
  prepareOneTimeQuery(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): SQLitePreparedQuery<PreparedQueryConfig & {
    type: TResultKind;
  }>;
  abstract prepareRelationalQuery(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, customResultMapper: (rows: Record<string, unknown>[], mapColumnValue?: (value: unknown) => unknown) => unknown): SQLitePreparedQuery<PreparedQueryConfig & {
    type: TResultKind;
  }>;
  prepareOneTimeRelationalQuery(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, customResultMapper: (rows: Record<string, unknown>[], mapColumnValue?: (value: unknown) => unknown) => unknown): SQLitePreparedQuery<PreparedQueryConfig & {
    type: TResultKind;
  }>;
  abstract transaction<T>(transaction: (tx: SQLiteTransaction<TResultKind, TRunResult, TFullSchema, TRelations, TSchema>) => Result<TResultKind, T>, config?: SQLiteTransactionConfig): Result<TResultKind, T>;
  run(query: SQL): Result<TResultKind, TRunResult>;
  all<T = unknown>(query: SQL): Result<TResultKind, T[]>;
  get<T = unknown>(query: SQL): Result<TResultKind, T>;
  values<T extends any[] = unknown[]>(query: SQL): Result<TResultKind, T[]>;
  count(sql: SQL): Promise<number>;
}
type Result<TKind extends 'sync' | 'async', TResult> = {
  sync: TResult;
  async: Promise<TResult>;
}[TKind];
type DBResult<TKind extends 'sync' | 'async', TResult> = {
  sync: TResult;
  async: SQLiteRaw<TResult>;
}[TKind];
declare abstract class SQLiteTransaction<TResultType extends 'sync' | 'async', TRunResult, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = V1.ExtractTablesWithRelations<TFullSchema>> extends BaseSQLiteDatabase<TResultType, TRunResult, TFullSchema, TRelations, TSchema> {
  protected relations: TRelations;
  protected schema: {
    fullSchema: Record<string, unknown>;
    schema: TSchema;
    tableNamesMap: Record<string, string>;
  } | undefined;
  protected readonly nestedIndex: number;
  static readonly [entityKind]: string;
  constructor(resultType: TResultType, dialect: {
    sync: SQLiteSyncDialect;
    async: SQLiteAsyncDialect;
  }[TResultType], session: SQLiteSession<TResultType, TRunResult, TFullSchema, TRelations, TSchema>, relations: TRelations, schema: {
    fullSchema: Record<string, unknown>;
    schema: TSchema;
    tableNamesMap: Record<string, string>;
  } | undefined, nestedIndex?: number, rowModeRQB?: boolean, forbidJsonb?: boolean);
  rollback(): never;
}
//#endregion
export { DBResult, ExecuteResult, ExecuteResultSync, PreparedQueryConfig, Result, SQLiteExecuteMethod, SQLitePreparedQuery, SQLiteSession, SQLiteTransaction, SQLiteTransactionConfig };
//# sourceMappingURL=session.d.cts.map