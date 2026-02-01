import { entityKind } from "../entity.js";
import { Assume } from "../utils.js";
import { Query } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../pg-core/async/session.js";
import { PgDialect } from "../pg-core/index.js";
import { QueryResult, QueryResultRow, VercelClient, VercelPool, VercelPoolClient } from "@vercel/postgres";
import { Cache } from "../cache/core/cache.js";
import { AnyRelations } from "../relations.js";
import { WithCacheConfig } from "../cache/core/types.js";
import { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.js";
import { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.js";

//#region src/vercel-postgres/session.d.ts
type VercelPgClient = VercelPool | VercelClient | VercelPoolClient;
declare class VercelPgPreparedQuery<T extends PreparedQueryConfig, TIsRqbV2 extends boolean = false> extends PgAsyncPreparedQuery<T> {
  private client;
  private params;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  private rawQuery;
  private queryConfig;
  constructor(client: VercelPgClient, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, name: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
  values(placeholderValues?: Record<string, unknown> | undefined): Promise<T['values']>;
}
interface VercelPgSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class VercelPgSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncSession<VercelPgQueryResultHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: VercelPgClient, dialect: PgDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: VercelPgSessionOptions);
  prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PgAsyncPreparedQuery<T>;
  prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute']): PgAsyncPreparedQuery<T>;
  query(query: string, params: unknown[]): Promise<QueryResult>;
  queryObjects<T extends QueryResultRow>(query: string, params: unknown[]): Promise<QueryResult<T>>;
  transaction<T>(transaction: (tx: VercelPgTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, config?: PgTransactionConfig | undefined): Promise<T>;
}
declare class VercelPgTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncTransaction<VercelPgQueryResultHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: VercelPgTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface VercelPgQueryResultHKT extends PgQueryResultHKT {
  type: QueryResult<Assume<this['row'], QueryResultRow>>;
}
//#endregion
export { VercelPgClient, VercelPgPreparedQuery, VercelPgQueryResultHKT, VercelPgSession, VercelPgSessionOptions, VercelPgTransaction };
//# sourceMappingURL=session.d.ts.map