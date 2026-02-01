import { entityKind } from "../entity.js";
import { Assume } from "../utils.js";
import { Query } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { PgDialect } from "../pg-core/dialect.js";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../pg-core/async/session.js";
import { Cache } from "../cache/core/cache.js";
import { Client, Pool, PoolClient, QueryResult, QueryResultRow } from "@neondatabase/serverless";
import { AnyRelations } from "../relations.js";
import { WithCacheConfig } from "../cache/core/types.js";
import { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.js";
import { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.js";

//#region src/neon-serverless/session.d.ts
type NeonClient = Pool | PoolClient | Client;
declare class NeonPreparedQuery<T extends PreparedQueryConfig, TIsRqbV2 extends boolean = false> extends PgAsyncPreparedQuery<T> {
  private client;
  private params;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  private rawQueryConfig;
  private queryConfig;
  constructor(client: NeonClient, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, name: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
  values(placeholderValues?: Record<string, unknown> | undefined): Promise<T['values']>;
}
interface NeonSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class NeonSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncSession<NeonQueryResultHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: NeonClient, dialect: PgDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: NeonSessionOptions);
  prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PgAsyncPreparedQuery<T>;
  prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper?: (rows: Record<string, unknown>[]) => T['execute']): PgAsyncPreparedQuery<T>;
  query(query: string, params: unknown[]): Promise<QueryResult>;
  queryObjects<T extends QueryResultRow>(query: string, params: unknown[]): Promise<QueryResult<T>>;
  transaction<T>(transaction: (tx: NeonTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
declare class NeonTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncTransaction<NeonQueryResultHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: NeonTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface NeonQueryResultHKT extends PgQueryResultHKT {
  type: QueryResult<Assume<this['row'], QueryResultRow>>;
}
//#endregion
export { NeonClient, NeonPreparedQuery, NeonQueryResultHKT, NeonSession, NeonSessionOptions, NeonTransaction };
//# sourceMappingURL=session.d.ts.map