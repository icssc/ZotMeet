import { entityKind } from "../../entity.js";
import { Assume } from "../../utils.js";
import { Query, SQL } from "../../sql/sql.js";
import * as V1 from "../../_relations.js";
import { Logger } from "../../logger.js";
import { Cache } from "../../cache/core/index.js";
import { MySqlDialect } from "../../mysql-core/dialect.js";
import { Mode, MySqlPreparedQuery, MySqlPreparedQueryConfig, MySqlPreparedQueryHKT, MySqlQueryResultHKT, MySqlSession, MySqlTransaction, MySqlTransactionConfig, PreparedQueryKind } from "../../mysql-core/session.js";
import { AnyRelations } from "../../relations.js";
import { SQL as SQL$1 } from "bun";
import { WithCacheConfig } from "../../cache/core/types.js";
import { SelectedFieldsOrdered } from "../../mysql-core/query-builders/select.types.js";

//#region src/bun-sql/mysql/session.d.ts
declare class BunMySqlPreparedQuery<T extends MySqlPreparedQueryConfig, TIsRqbV2 extends boolean = false> extends MySqlPreparedQuery<T> {
  private client;
  private query;
  private params;
  private logger;
  private fields;
  private customResultMapper?;
  private generatedIds?;
  private returningIds?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: SQL$1, query: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
  private executeRqbV2;
  iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['execute'] extends any[] ? T['execute'][number] : T['execute']>;
}
interface BunMySqlSessionOptions {
  logger?: Logger;
  cache?: Cache;
  mode: Mode;
}
declare class BunMySqlSession<TSQL extends SQL$1, TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends MySqlSession<MySqlQueryResultHKT, BunMySqlPreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  readonly client: TSQL;
  private relations;
  private schema;
  readonly options: BunMySqlSessionOptions;
  static readonly [entityKind]: string;
  private logger;
  private mode;
  private cache;
  constructor(client: TSQL, dialect: MySqlDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options: BunMySqlSessionOptions);
  prepareQuery<T extends MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PreparedQueryKind<BunMySqlPreparedQueryHKT, T>;
  prepareRelationalQuery<T extends MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<BunMySqlPreparedQueryHKT, T>;
  all<T = unknown>(query: SQL): Promise<T[]>;
  count(sql: SQL): Promise<number>;
  transaction<T>(transaction: (tx: BunMySqlTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, config?: MySqlTransactionConfig): Promise<T>;
}
declare class BunMySqlTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends MySqlTransaction<BunMySqlQueryResultHKT, BunMySqlPreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: BunMySqlTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface BunMySqlQueryResultHKT extends MySqlQueryResultHKT {
  type: Record<string, unknown>[] & Record<string, unknown>;
}
interface BunMySqlPreparedQueryHKT extends MySqlPreparedQueryHKT {
  type: BunMySqlPreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
//#endregion
export { BunMySqlPreparedQuery, BunMySqlPreparedQueryHKT, BunMySqlQueryResultHKT, BunMySqlSession, BunMySqlSessionOptions, BunMySqlTransaction };
//# sourceMappingURL=session.d.ts.map