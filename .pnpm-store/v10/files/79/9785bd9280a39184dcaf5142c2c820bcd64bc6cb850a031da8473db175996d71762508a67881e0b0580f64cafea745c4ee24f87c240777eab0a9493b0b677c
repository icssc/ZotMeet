import { entityKind } from "../../entity.js";
import { QueryTypingsValue, QueryWithTypings, SQL } from "../../sql/sql.js";
import * as V1 from "../../_relations.js";
import { Logger } from "../../logger.js";
import { PgDialect } from "../../pg-core/dialect.js";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../../pg-core/async/session.js";
import { Cache } from "../../cache/core/cache.js";
import { AnyRelations } from "../../relations.js";
import { ExecuteStatementCommandOutput, RDSDataClient } from "@aws-sdk/client-rds-data";
import { WithCacheConfig } from "../../cache/core/types.js";
import { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../../pg-core/session.js";
import { SelectedFieldsOrdered } from "../../pg-core/query-builders/select.types.js";

//#region src/aws-data-api/pg/session.d.ts
type AwsDataApiClient = RDSDataClient;
declare class AwsDataApiPreparedQuery<T extends PreparedQueryConfig & {
  values: AwsDataApiPgQueryResult<unknown[]>;
}, TIsRqbV2 extends boolean = false> extends PgAsyncPreparedQuery<T> {
  private client;
  private queryString;
  private params;
  private typings;
  private options;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  private rawQuery;
  constructor(client: AwsDataApiClient, queryString: string, params: unknown[], typings: QueryTypingsValue[], options: AwsDataApiSessionOptions, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, /** @internal */
  transactionId: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
  values(placeholderValues?: Record<string, unknown>): Promise<T['values']>;
}
interface AwsDataApiSessionOptions {
  logger?: Logger;
  cache?: Cache;
  database: string;
  resourceArn: string;
  secretArn: string;
}
declare class AwsDataApiSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncSession<AwsDataApiPgQueryResultHKT, TFullSchema, TRelations, TSchema> {
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private cache;
  constructor(/** @internal */
  client: AwsDataApiClient, dialect: PgDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options: AwsDataApiSessionOptions, /** @internal */
  transactionId: string | undefined);
  prepareQuery<T extends PreparedQueryConfig & {
    values: AwsDataApiPgQueryResult<unknown[]>;
  } = PreparedQueryConfig & {
    values: AwsDataApiPgQueryResult<unknown[]>;
  }>(query: QueryWithTypings, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig, transactionId?: string): AwsDataApiPreparedQuery<T>;
  prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: QueryWithTypings, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute'], transactionId?: string): PgAsyncPreparedQuery<T>;
  execute<T>(query: SQL): Promise<T>;
  transaction<T>(transaction: (tx: AwsDataApiTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, config?: PgTransactionConfig | undefined): Promise<T>;
}
declare class AwsDataApiTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends PgAsyncTransaction<AwsDataApiPgQueryResultHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: AwsDataApiTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
type AwsDataApiPgQueryResult<T> = ExecuteStatementCommandOutput & {
  rows: T[];
};
interface AwsDataApiPgQueryResultHKT extends PgQueryResultHKT {
  type: AwsDataApiPgQueryResult<any>;
}
//#endregion
export { AwsDataApiClient, AwsDataApiPgQueryResult, AwsDataApiPgQueryResultHKT, AwsDataApiPreparedQuery, AwsDataApiSession, AwsDataApiSessionOptions, AwsDataApiTransaction };
//# sourceMappingURL=session.d.ts.map