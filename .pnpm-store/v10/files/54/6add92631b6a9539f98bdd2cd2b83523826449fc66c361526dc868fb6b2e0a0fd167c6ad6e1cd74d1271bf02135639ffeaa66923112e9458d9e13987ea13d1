import { RemoteCallback } from "./driver.js";
import { entityKind } from "../entity.js";
import { Assume } from "../utils.js";
import { QueryWithTypings } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { PgDialect } from "../pg-core/dialect.js";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../pg-core/async/session.js";
import { Cache } from "../cache/core/cache.js";
import { AnyRelations } from "../relations.js";
import { WithCacheConfig } from "../cache/core/types.js";
import { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.js";
import { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.js";

//#region src/pg-proxy/session.d.ts
interface PgRemoteSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class PgRemoteSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncSession<PgRemoteQueryResultHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: RemoteCallback, dialect: PgDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: PgRemoteSessionOptions);
  prepareQuery<T extends PreparedQueryConfig>(query: QueryWithTypings, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PreparedQuery<T>;
  prepareRelationalQuery<T extends PreparedQueryConfig>(query: QueryWithTypings, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper?: (rows: Record<string, unknown>[]) => T['execute']): PreparedQuery<T, true>;
  transaction<T>(_transaction: (tx: PgProxyTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
declare class PgProxyTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncTransaction<PgRemoteQueryResultHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(_transaction: (tx: PgProxyTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare class PreparedQuery<T extends PreparedQueryConfig, TIsRqbV2 extends boolean = false> extends PgAsyncPreparedQuery<T> {
  private client;
  private queryString;
  private params;
  private typings;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: RemoteCallback, queryString: string, params: unknown[], typings: any[] | undefined, logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  all(): Promise<void>;
}
interface PgRemoteQueryResultHKT extends PgQueryResultHKT {
  type: Assume<this['row'], {
    [column: string]: any;
  }>[];
}
//#endregion
export { PgProxyTransaction, PgRemoteQueryResultHKT, PgRemoteSession, PgRemoteSessionOptions, PreparedQuery };
//# sourceMappingURL=session.d.ts.map