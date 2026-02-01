import { entityKind } from "../entity.cjs";
import { Query } from "../sql/sql.cjs";
import { Assume } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";
import { AnyRelations } from "../relations.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.cjs";
import { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.cjs";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../pg-core/async/session.cjs";
import { Logger } from "../logger.cjs";
import { Cache } from "../cache/core/index.cjs";
import pg, { Client, PoolClient, QueryResult, QueryResultRow } from "pg";

//#region src/node-postgres/session.d.ts

type NodePgClient = pg.Pool | PoolClient | Client;
declare class NodePgPreparedQuery<T extends PreparedQueryConfig, TIsRqbV2 extends boolean = false> extends PgAsyncPreparedQuery<T> {
  private client;
  private queryString;
  private params;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  private rawQueryConfig;
  private queryConfig;
  constructor(client: NodePgClient, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, name: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
interface NodePgSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class NodePgSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncSession<NodePgQueryResultHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: NodePgClient, dialect: PgDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: NodePgSessionOptions);
  prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): NodePgPreparedQuery<T, false>;
  prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper?: (rows: Record<string, unknown>[]) => T['execute']): NodePgPreparedQuery<T, true>;
  transaction<T>(transaction: (tx: NodePgTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, config?: PgTransactionConfig | undefined): Promise<T>;
}
declare class NodePgTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncTransaction<NodePgQueryResultHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: NodePgTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface NodePgQueryResultHKT extends PgQueryResultHKT {
  type: QueryResult<Assume<this['row'], QueryResultRow>>;
}
//#endregion
export { NodePgClient, NodePgPreparedQuery, NodePgQueryResultHKT, NodePgSession, NodePgSessionOptions, NodePgTransaction };
//# sourceMappingURL=session.d.cts.map