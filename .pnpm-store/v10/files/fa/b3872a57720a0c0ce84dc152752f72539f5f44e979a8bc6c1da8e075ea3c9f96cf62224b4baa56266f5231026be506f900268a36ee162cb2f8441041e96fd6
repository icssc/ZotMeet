import { RemoteCallback } from "./driver.cjs";
import { entityKind } from "../entity.cjs";
import { Query, SQL } from "../sql/sql.cjs";
import { Assume } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";
import { AnyRelations } from "../relations.cjs";
import { FieldPacket, ResultSetHeader } from "mysql2/promise";
import { MySqlDialect } from "../mysql-core/dialect.cjs";
import { MySqlPreparedQuery, MySqlPreparedQueryConfig, MySqlPreparedQueryHKT, MySqlQueryResultHKT, MySqlSession, MySqlTransactionConfig, PreparedQueryKind } from "../mysql-core/session.cjs";
import { Logger } from "../logger.cjs";
import { Cache } from "../cache/core/index.cjs";
import { SelectedFieldsOrdered } from "../mysql-core/query-builders/select.types.cjs";
import { MySqlTransaction as MySqlTransaction$1 } from "../mysql-core/index.cjs";

//#region src/mysql-proxy/session.d.ts
type MySqlRawQueryResult = [ResultSetHeader, FieldPacket[]];
interface MySqlRemoteSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class MySqlRemoteSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends MySqlSession<MySqlRemoteQueryResultHKT, MySqlRemotePreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: RemoteCallback, dialect: MySqlDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options: MySqlRemoteSessionOptions);
  prepareQuery<T extends MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PreparedQueryKind<MySqlRemotePreparedQueryHKT, T>;
  prepareRelationalQuery<T extends MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<MySqlRemotePreparedQueryHKT, T>;
  all<T = unknown>(query: SQL): Promise<T[]>;
  transaction<T>(_transaction: (tx: MySqlProxyTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, _config?: MySqlTransactionConfig): Promise<T>;
}
declare class MySqlProxyTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends MySqlTransaction$1<MySqlRemoteQueryResultHKT, MySqlRemotePreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(_transaction: (tx: MySqlProxyTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare class PreparedQuery<T extends MySqlPreparedQueryConfig, TIsRqbV2 extends boolean = false> extends MySqlPreparedQuery<T> {
  private client;
  private queryString;
  private params;
  private logger;
  private fields;
  private customResultMapper?;
  private generatedIds?;
  private returningIds?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: RemoteCallback, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  iterator(_placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
interface MySqlRemoteQueryResultHKT extends MySqlQueryResultHKT {
  type: MySqlRawQueryResult;
}
interface MySqlRemotePreparedQueryHKT extends MySqlPreparedQueryHKT {
  type: PreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
//#endregion
export { MySqlProxyTransaction, MySqlRawQueryResult, MySqlRemotePreparedQueryHKT, MySqlRemoteQueryResultHKT, MySqlRemoteSession, MySqlRemoteSessionOptions, PreparedQuery };
//# sourceMappingURL=session.d.cts.map