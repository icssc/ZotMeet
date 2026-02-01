import { entityKind } from "../entity.cjs";
import { Query } from "../sql/sql.cjs";
import * as V1 from "../_relations.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";
import { AnyRelations } from "../relations.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.cjs";
import { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.cjs";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../pg-core/async/session.cjs";
import { Logger } from "../logger.cjs";
import { Cache } from "../cache/core/index.cjs";
import { BatchItem } from "../batch.cjs";
import { FullQueryResults, NeonQueryFunction } from "@neondatabase/serverless";

//#region src/neon-http/session.d.ts
type NeonHttpClient = NeonQueryFunction<any, any>;
declare class NeonHttpPreparedQuery<T extends PreparedQueryConfig, TIsRqbV2 extends boolean = false> extends PgAsyncPreparedQuery<T> {
  private client;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  private clientQuery;
  constructor(client: NeonHttpClient, query: Query, logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  mapResult(result: unknown): unknown;
  all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
  values(placeholderValues: Record<string, unknown> | undefined): Promise<T['values']>;
}
interface NeonHttpSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class NeonHttpSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncSession<NeonHttpQueryResultHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private clientQuery;
  private logger;
  private cache;
  constructor(client: NeonHttpClient, dialect: PgDialect, relations: AnyRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: NeonHttpSessionOptions);
  prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PgAsyncPreparedQuery<T>;
  prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute']): PgAsyncPreparedQuery<T>;
  batch<U extends BatchItem<'pg'>, T extends Readonly<[U, ...U[]]>>(queries: T): Promise<any>;
  query(query: string, params: unknown[]): Promise<FullQueryResults<true>>;
  queryObjects(query: string, params: unknown[]): Promise<FullQueryResults<false>>;
  transaction<T>(_transaction: (tx: NeonTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
declare class NeonTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncTransaction<NeonHttpQueryResultHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(_transaction: (tx: NeonTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
type NeonHttpQueryResult<T> = Omit<FullQueryResults<false>, 'rows'> & {
  rows: T[];
};
interface NeonHttpQueryResultHKT extends PgQueryResultHKT {
  type: NeonHttpQueryResult<this['row']>;
}
//#endregion
export { NeonHttpClient, NeonHttpPreparedQuery, NeonHttpQueryResult, NeonHttpQueryResultHKT, NeonHttpSession, NeonHttpSessionOptions, NeonTransaction };
//# sourceMappingURL=session.d.cts.map