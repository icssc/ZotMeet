import { entityKind } from "../../entity.cjs";
import { Query } from "../../sql/sql.cjs";
import { Assume } from "../../utils.cjs";
import * as V1 from "../../_relations.cjs";
import { WithCacheConfig } from "../../cache/core/types.cjs";
import { AnyRelations } from "../../relations.cjs";
import { PgDialect } from "../../pg-core/dialect.cjs";
import { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../../pg-core/session.cjs";
import { SelectedFieldsOrdered } from "../../pg-core/query-builders/select.types.cjs";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../../pg-core/async/session.cjs";
import { Logger } from "../../logger.cjs";
import { Cache } from "../../cache/core/index.cjs";
import { SQL as SQL$1, SavepointSQL, TransactionSQL } from "bun";

//#region src/bun-sql/postgres/session.d.ts
declare class BunSQLPreparedQuery<T extends PreparedQueryConfig, TIsRqbV2 extends boolean = false> extends PgAsyncPreparedQuery<T> {
  private client;
  private queryString;
  private params;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: SQL$1, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  executeRqbV2(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
interface BunSQLSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class BunSQLSession<TSQL extends SQL$1, TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncSession<BunSQLQueryResultHKT, TFullSchema, TRelations, TSchema> {
  readonly client: TSQL;
  private relations;
  private schema;
  static readonly [entityKind]: string;
  logger: Logger;
  private cache;
  constructor(client: TSQL, dialect: PgDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, /** @internal */
  options?: BunSQLSessionOptions);
  prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PgAsyncPreparedQuery<T>;
  prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper?: (rows: Record<string, unknown>[]) => T['execute']): PgAsyncPreparedQuery<T>;
  query(query: string, params: unknown[]): Promise<any>;
  queryObjects(query: string, params: unknown[]): Promise<any>;
  transaction<T>(transaction: (tx: BunSQLTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
declare class BunSQLTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncTransaction<BunSQLQueryResultHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  constructor(dialect: PgDialect, /** @internal */
  session: BunSQLSession<TransactionSQL | SavepointSQL, TFullSchema, TRelations, TSchema>, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, nestedIndex?: number);
  transaction<T>(transaction: (tx: BunSQLTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface BunSQLQueryResultHKT extends PgQueryResultHKT {
  type: Assume<this['row'], Record<string, any>[]>;
}
//#endregion
export { BunSQLPreparedQuery, BunSQLQueryResultHKT, BunSQLSession, BunSQLSessionOptions, BunSQLTransaction };
//# sourceMappingURL=session.d.cts.map