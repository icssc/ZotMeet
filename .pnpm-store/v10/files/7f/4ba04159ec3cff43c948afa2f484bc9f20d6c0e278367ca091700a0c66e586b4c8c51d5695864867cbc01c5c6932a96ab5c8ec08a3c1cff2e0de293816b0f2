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
import { Row, RowList, Sql, TransactionSql } from "postgres";

//#region src/postgres-js/session.d.ts
declare class PostgresJsPreparedQuery<T extends PreparedQueryConfig, TIsRqbV2 extends boolean = false> extends PgAsyncPreparedQuery<T> {
  private client;
  private queryString;
  private params;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: Sql, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
interface PostgresJsSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class PostgresJsSession<TSQL extends Sql, TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncSession<PostgresJsQueryResultHKT, TFullSchema, TRelations, TSchema> {
  client: TSQL;
  private relations;
  private schema;
  static readonly [entityKind]: string;
  logger: Logger;
  private cache;
  constructor(client: TSQL, dialect: PgDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, /** @internal */
  options?: PostgresJsSessionOptions);
  prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PgAsyncPreparedQuery<T>;
  prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute']): PgAsyncPreparedQuery<T>;
  query(query: string, params: unknown[]): Promise<RowList<Row[]>>;
  queryObjects<T extends Row>(query: string, params: unknown[]): Promise<RowList<T[]>>;
  transaction<T>(transaction: (tx: PostgresJsTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
declare class PostgresJsTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncTransaction<PostgresJsQueryResultHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  constructor(dialect: PgDialect, /** @internal */
  session: PostgresJsSession<TransactionSql, TFullSchema, TRelations, TSchema>, schema: V1.RelationalSchemaConfig<TSchema> | undefined, relations: TRelations, nestedIndex?: number);
  transaction<T>(transaction: (tx: PostgresJsTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface PostgresJsQueryResultHKT extends PgQueryResultHKT {
  type: RowList<Assume<this['row'], Row>[]>;
}
//#endregion
export { PostgresJsPreparedQuery, PostgresJsQueryResultHKT, PostgresJsSession, PostgresJsSessionOptions, PostgresJsTransaction };
//# sourceMappingURL=session.d.cts.map