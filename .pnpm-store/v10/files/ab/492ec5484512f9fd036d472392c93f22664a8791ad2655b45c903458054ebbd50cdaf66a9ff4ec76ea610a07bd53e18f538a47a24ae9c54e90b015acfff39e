import { entityKind } from "../entity.cjs";
import { Query, SQL } from "../sql/sql.cjs";
import { Assume } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";
import { AnyRelations } from "../relations.cjs";
import { Connection, FieldPacket, OkPacket, Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { SingleStoreDialect } from "../singlestore-core/dialect.cjs";
import { PreparedQueryKind, SingleStorePreparedQuery, SingleStorePreparedQueryConfig, SingleStorePreparedQueryHKT, SingleStoreQueryResultHKT, SingleStoreSession, SingleStoreTransaction, SingleStoreTransactionConfig } from "../singlestore-core/session.cjs";
import { Logger } from "../logger.cjs";
import { Cache } from "../cache/core/index.cjs";
import { SelectedFieldsOrdered } from "../singlestore-core/query-builders/select.types.cjs";

//#region src/singlestore/session.d.ts
type SingleStoreDriverClient = Pool | Connection;
type SingleStoreRawQueryResult = [ResultSetHeader, FieldPacket[]];
type SingleStoreQueryResultType = RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader;
type SingleStoreQueryResult<T = any> = [T extends ResultSetHeader ? T : T[], FieldPacket[]];
declare class SingleStoreDriverPreparedQuery<T extends SingleStorePreparedQueryConfig, TIsRqbV2 extends boolean = false> extends SingleStorePreparedQuery<T> {
  private client;
  private params;
  private logger;
  private fields;
  private customResultMapper?;
  private generatedIds?;
  private returningIds?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  private rawQuery;
  private query;
  constructor(client: SingleStoreDriverClient, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
  private executeRqbV2;
  iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['execute'] extends any[] ? T['execute'][number] : T['execute']>;
}
interface SingleStoreDriverSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class SingleStoreDriverSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SingleStoreSession<SingleStoreQueryResultHKT, SingleStoreDriverPreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: SingleStoreDriverClient, dialect: SingleStoreDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options: SingleStoreDriverSessionOptions);
  prepareQuery<T extends SingleStorePreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PreparedQueryKind<SingleStoreDriverPreparedQueryHKT, T>;
  prepareRelationalQuery<T extends SingleStorePreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<SingleStorePreparedQueryHKT, T>;
  all<T = unknown>(query: SQL): Promise<T[]>;
  transaction<T>(transaction: (tx: SingleStoreDriverTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, config?: SingleStoreTransactionConfig): Promise<T>;
}
declare class SingleStoreDriverTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SingleStoreTransaction<SingleStoreDriverQueryResultHKT, SingleStoreDriverPreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: SingleStoreDriverTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface SingleStoreDriverQueryResultHKT extends SingleStoreQueryResultHKT {
  type: SingleStoreRawQueryResult;
}
interface SingleStoreDriverPreparedQueryHKT extends SingleStorePreparedQueryHKT {
  type: SingleStoreDriverPreparedQuery<Assume<this['config'], SingleStorePreparedQueryConfig>>;
}
//#endregion
export { SingleStoreDriverClient, SingleStoreDriverPreparedQuery, SingleStoreDriverPreparedQueryHKT, SingleStoreDriverQueryResultHKT, SingleStoreDriverSession, SingleStoreDriverSessionOptions, SingleStoreDriverTransaction, SingleStoreQueryResult, SingleStoreQueryResultType, SingleStoreRawQueryResult };
//# sourceMappingURL=session.d.cts.map