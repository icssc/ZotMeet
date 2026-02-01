import { entityKind } from "../entity.cjs";
import { Query, SQL } from "../sql/sql.cjs";
import { Assume } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";
import { AnyRelations } from "../relations.cjs";
import { Connection, FieldPacket, OkPacket, Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { MySqlDialect } from "../mysql-core/dialect.cjs";
import { Mode, MySqlPreparedQuery, MySqlPreparedQueryConfig, MySqlPreparedQueryHKT, MySqlQueryResultHKT, MySqlSession, MySqlTransaction, MySqlTransactionConfig, PreparedQueryKind } from "../mysql-core/session.cjs";
import { Logger } from "../logger.cjs";
import { Cache } from "../cache/core/index.cjs";
import { SelectedFieldsOrdered } from "../mysql-core/query-builders/select.types.cjs";

//#region src/mysql2/session.d.ts
type MySql2Client = Pool | Connection;
type MySqlRawQueryResult = [ResultSetHeader, FieldPacket[]];
type MySqlQueryResultType = RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader;
type MySqlQueryResult<T = any> = [T extends ResultSetHeader ? T : T[], FieldPacket[]];
declare class MySql2PreparedQuery<T extends MySqlPreparedQueryConfig, TIsRqbV2 extends boolean = false> extends MySqlPreparedQuery<T> {
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
  constructor(client: MySql2Client, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
  private executeRqbV2;
  iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['execute'] extends any[] ? T['execute'][number] : T['execute']>;
}
interface MySql2SessionOptions {
  logger?: Logger;
  cache?: Cache;
  mode: Mode;
}
declare class MySql2Session<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends MySqlSession<MySqlQueryResultHKT, MySql2PreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  private mode;
  private cache;
  constructor(client: MySql2Client, dialect: MySqlDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options: MySql2SessionOptions);
  prepareQuery<T extends MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PreparedQueryKind<MySql2PreparedQueryHKT, T>;
  prepareRelationalQuery<T extends MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<MySql2PreparedQueryHKT, T>;
  all<T = unknown>(query: SQL): Promise<T[]>;
  transaction<T>(transaction: (tx: MySql2Transaction<TFullSchema, TRelations, TSchema>) => Promise<T>, config?: MySqlTransactionConfig): Promise<T>;
}
declare class MySql2Transaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends MySqlTransaction<MySql2QueryResultHKT, MySql2PreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: MySql2Transaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface MySql2QueryResultHKT extends MySqlQueryResultHKT {
  type: MySqlRawQueryResult;
}
interface MySql2PreparedQueryHKT extends MySqlPreparedQueryHKT {
  type: MySql2PreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
//#endregion
export { MySql2Client, MySql2PreparedQuery, MySql2PreparedQueryHKT, MySql2QueryResultHKT, MySql2Session, MySql2SessionOptions, MySql2Transaction, MySqlQueryResult, MySqlQueryResultType, MySqlRawQueryResult };
//# sourceMappingURL=session.d.cts.map