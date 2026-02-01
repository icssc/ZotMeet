import { MySqlDialect } from "./dialect.js";
import { MySqlDatabase } from "./db.js";
import { SelectedFieldsOrdered } from "./query-builders/select.types.js";
import { entityKind } from "../entity.js";
import { Assume, Equal } from "../utils.js";
import { Query, SQL } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Cache } from "../cache/core/cache.js";
import { AnyRelations, EmptyRelations } from "../relations.js";
import { WithCacheConfig } from "../cache/core/types.js";

//#region src/mysql-core/session.d.ts
type Mode = 'default' | 'planetscale';
interface MySqlQueryResultHKT {
  readonly $brand: 'MySqlQueryResultHKT';
  readonly row: unknown;
  readonly type: unknown;
}
interface AnyMySqlQueryResultHKT extends MySqlQueryResultHKT {
  readonly type: any;
}
type MySqlQueryResultKind<TKind extends MySqlQueryResultHKT, TRow> = (TKind & {
  readonly row: TRow;
})['type'];
interface MySqlPreparedQueryConfig {
  execute: unknown;
  iterator: unknown;
}
interface MySqlPreparedQueryHKT {
  readonly $brand: 'MySqlPreparedQueryHKT';
  readonly config: unknown;
  readonly type: unknown;
}
type PreparedQueryKind<TKind extends MySqlPreparedQueryHKT, TConfig extends MySqlPreparedQueryConfig, TAssume extends boolean = false> = Equal<TAssume, true> extends true ? Assume<(TKind & {
  readonly config: TConfig;
})['type'], MySqlPreparedQuery<TConfig>> : (TKind & {
  readonly config: TConfig;
})['type'];
declare abstract class MySqlPreparedQuery<T extends MySqlPreparedQueryConfig> {
  private cache;
  private queryMetadata;
  private cacheConfig?;
  static readonly [entityKind]: string;
  constructor(
  // cache instance
  cache: Cache | undefined, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig?: WithCacheConfig | undefined);
  abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
  abstract iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
interface MySqlTransactionConfig {
  withConsistentSnapshot?: boolean;
  accessMode?: 'read only' | 'read write';
  isolationLevel: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable';
}
declare abstract class MySqlSession<TQueryResult extends MySqlQueryResultHKT = MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = V1.ExtractTablesWithRelations<TFullSchema>> {
  protected dialect: MySqlDialect;
  static readonly [entityKind]: string;
  constructor(dialect: MySqlDialect);
  abstract prepareQuery<T extends MySqlPreparedQueryConfig, TPreparedQueryHKT extends MySqlPreparedQueryHKT>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PreparedQueryKind<TPreparedQueryHKT, T>;
  abstract prepareRelationalQuery<T extends MySqlPreparedQueryConfig, TPreparedQueryHKT extends MySqlPreparedQueryHKT>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<TPreparedQueryHKT, T>;
  execute<T>(query: SQL): Promise<T>;
  abstract all<T = unknown>(query: SQL): Promise<T[]>;
  count(sql: SQL): Promise<number>;
  abstract transaction<T>(transaction: (tx: MySqlTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TRelations, TSchema>) => Promise<T>, config?: MySqlTransactionConfig): Promise<T>;
  protected getSetTransactionSQL(config: MySqlTransactionConfig): SQL | undefined;
  protected getStartTransactionSQL(config: MySqlTransactionConfig): SQL | undefined;
}
declare abstract class MySqlTransaction<TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = V1.ExtractTablesWithRelations<TFullSchema>> extends MySqlDatabase<TQueryResult, TPreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  protected relations: TRelations;
  protected schema: V1.RelationalSchemaConfig<TSchema> | undefined;
  protected readonly nestedIndex: number;
  static readonly [entityKind]: string;
  constructor(dialect: MySqlDialect, session: MySqlSession, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, nestedIndex: number, mode: Mode);
  rollback(): never;
  /** Nested transactions (aka savepoints) only work with InnoDB engine. */
  abstract transaction<T>(transaction: (tx: MySqlTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface PreparedQueryHKTBase extends MySqlPreparedQueryHKT {
  type: MySqlPreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
//#endregion
export { AnyMySqlQueryResultHKT, Mode, MySqlPreparedQuery, MySqlPreparedQueryConfig, MySqlPreparedQueryHKT, MySqlQueryResultHKT, MySqlQueryResultKind, MySqlSession, MySqlTransaction, MySqlTransactionConfig, PreparedQueryHKTBase, PreparedQueryKind };
//# sourceMappingURL=session.d.ts.map