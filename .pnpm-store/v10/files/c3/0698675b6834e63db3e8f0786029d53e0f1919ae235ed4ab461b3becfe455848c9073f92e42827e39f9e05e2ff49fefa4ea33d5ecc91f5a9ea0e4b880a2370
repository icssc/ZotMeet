import { SingleStoreDialect } from "./dialect.cjs";
import { SingleStoreDatabase } from "./db.cjs";
import { SelectedFieldsOrdered } from "./query-builders/select.types.cjs";
import { entityKind } from "../entity.cjs";
import { Query, SQL } from "../sql/sql.cjs";
import { Assume, Equal } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { Cache } from "../cache/core/cache.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";

//#region src/singlestore-core/session.d.ts
interface SingleStoreQueryResultHKT {
  readonly $brand: 'SingleStoreQueryResultHKT';
  readonly row: unknown;
  readonly type: unknown;
}
interface AnySingleStoreQueryResultHKT extends SingleStoreQueryResultHKT {
  readonly type: any;
}
type SingleStoreQueryResultKind<TKind extends SingleStoreQueryResultHKT, TRow> = (TKind & {
  readonly row: TRow;
})['type'];
interface SingleStorePreparedQueryConfig {
  execute: unknown;
  iterator: unknown;
}
interface SingleStorePreparedQueryHKT {
  readonly $brand: 'SingleStorePreparedQueryHKT';
  readonly config: unknown;
  readonly type: unknown;
}
type PreparedQueryKind<TKind extends SingleStorePreparedQueryHKT, TConfig extends SingleStorePreparedQueryConfig, TAssume extends boolean = false> = Equal<TAssume, true> extends true ? Assume<(TKind & {
  readonly config: TConfig;
})['type'], SingleStorePreparedQuery<TConfig>> : (TKind & {
  readonly config: TConfig;
})['type'];
declare abstract class SingleStorePreparedQuery<T extends SingleStorePreparedQueryConfig> {
  private cache?;
  private queryMetadata?;
  private cacheConfig?;
  static readonly [entityKind]: string;
  constructor(cache?: Cache | undefined, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig?: WithCacheConfig | undefined);
  abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
  abstract iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
interface SingleStoreTransactionConfig {
  withConsistentSnapshot?: boolean;
  accessMode?: 'read only' | 'read write';
  isolationLevel: 'read committed';
}
declare abstract class SingleStoreSession<TQueryResult extends SingleStoreQueryResultHKT = SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = Record<string, never>> {
  protected dialect: SingleStoreDialect;
  static readonly [entityKind]: string;
  constructor(dialect: SingleStoreDialect);
  abstract prepareQuery<T extends SingleStorePreparedQueryConfig, TPreparedQueryHKT extends SingleStorePreparedQueryHKT>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PreparedQueryKind<TPreparedQueryHKT, T>;
  abstract prepareRelationalQuery<T extends SingleStorePreparedQueryConfig, TPreparedQueryHKT extends SingleStorePreparedQueryHKT>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<TPreparedQueryHKT, T>;
  execute<T>(query: SQL): Promise<T>;
  abstract all<T = unknown>(query: SQL): Promise<T[]>;
  count(sql: SQL): Promise<number>;
  abstract transaction<T>(transaction: (tx: SingleStoreTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TRelations, TSchema>) => Promise<T>, config?: SingleStoreTransactionConfig): Promise<T>;
  protected getSetTransactionSQL(config: SingleStoreTransactionConfig): SQL | undefined;
  protected getStartTransactionSQL(config: SingleStoreTransactionConfig): SQL | undefined;
}
declare abstract class SingleStoreTransaction<TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = Record<string, never>> extends SingleStoreDatabase<TQueryResult, TPreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  protected relations: TRelations;
  protected schema: V1.RelationalSchemaConfig<TSchema> | undefined;
  protected readonly nestedIndex: number;
  static readonly [entityKind]: string;
  constructor(dialect: SingleStoreDialect, session: SingleStoreSession, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, nestedIndex: number);
  rollback(): never;
  /** Nested transactions (aka savepoints) only work with InnoDB engine. */
  abstract transaction<T>(transaction: (tx: SingleStoreTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface PreparedQueryHKTBase extends SingleStorePreparedQueryHKT {
  type: SingleStorePreparedQuery<Assume<this['config'], SingleStorePreparedQueryConfig>>;
}
//#endregion
export { AnySingleStoreQueryResultHKT, PreparedQueryHKTBase, PreparedQueryKind, SingleStorePreparedQuery, SingleStorePreparedQueryConfig, SingleStorePreparedQueryHKT, SingleStoreQueryResultHKT, SingleStoreQueryResultKind, SingleStoreSession, SingleStoreTransaction, SingleStoreTransactionConfig };
//# sourceMappingURL=session.d.cts.map