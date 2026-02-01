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
import { SQLPluginResult, SQLQueryResult } from "@xata.io/client";

//#region src/xata-http/session.d.ts
type XataHttpClient = {
  sql: SQLPluginResult;
};
interface QueryResults<ArrayMode extends 'json' | 'array'> {
  rowCount: number;
  rows: ArrayMode extends 'array' ? any[][] : Record<string, any>[];
  rowAsArray: ArrayMode extends 'array' ? true : false;
}
declare class XataHttpPreparedQuery<T extends PreparedQueryConfig, TIsRqbV2 extends boolean = false> extends PgAsyncPreparedQuery<T> {
  private client;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: XataHttpClient, query: Query, logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
  values(placeholderValues?: Record<string, unknown> | undefined): Promise<T['values']>;
}
interface XataHttpSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class XataHttpSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncSession<XataHttpQueryResultHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: XataHttpClient, dialect: PgDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: XataHttpSessionOptions);
  prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PgAsyncPreparedQuery<T>;
  prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute']): PgAsyncPreparedQuery<T>;
  query(query: string, params: unknown[]): Promise<QueryResults<'array'>>;
  queryObjects(query: string, params: unknown[]): Promise<QueryResults<'json'>>;
  transaction<T>(_transaction: (tx: XataTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
declare class XataTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncTransaction<XataHttpQueryResultHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(_transaction: (tx: XataTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface XataHttpQueryResultHKT extends PgQueryResultHKT {
  type: SQLQueryResult<this['row']>;
}
//#endregion
export { QueryResults, XataHttpClient, XataHttpPreparedQuery, XataHttpQueryResultHKT, XataHttpSession, XataHttpSessionOptions, XataTransaction };
//# sourceMappingURL=session.d.cts.map