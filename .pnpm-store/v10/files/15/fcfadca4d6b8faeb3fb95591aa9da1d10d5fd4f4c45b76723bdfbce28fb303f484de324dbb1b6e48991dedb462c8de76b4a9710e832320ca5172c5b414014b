import { entityKind } from "../entity.js";
import { Assume } from "../utils.js";
import { Query, SQL } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { Cache } from "../cache/core/index.js";
import { Client, Connection, ExecutedQuery, Transaction } from "@planetscale/database";
import { MySqlDialect } from "../mysql-core/dialect.js";
import { MySqlPreparedQuery, MySqlPreparedQueryConfig, MySqlPreparedQueryHKT, MySqlQueryResultHKT, MySqlSession, MySqlTransaction } from "../mysql-core/session.js";
import { AnyRelations } from "../relations.js";
import { WithCacheConfig } from "../cache/core/types.js";
import { SelectedFieldsOrdered } from "../mysql-core/query-builders/select.types.js";

//#region src/planetscale-serverless/session.d.ts
declare class PlanetScalePreparedQuery<T extends MySqlPreparedQueryConfig, TIsRqbV2 extends boolean = false> extends MySqlPreparedQuery<T> {
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
  private rawQuery;
  private query;
  constructor(client: Client | Transaction | Connection, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  iterator(_placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
interface PlanetscaleSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class PlanetscaleSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends MySqlSession<MySqlQueryResultHKT, PlanetScalePreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  private baseClient;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  private client;
  private cache;
  constructor(baseClient: Client | Connection, dialect: MySqlDialect, tx: Transaction | undefined, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: PlanetscaleSessionOptions);
  prepareQuery<T extends MySqlPreparedQueryConfig = MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): MySqlPreparedQuery<T>;
  prepareRelationalQuery<T extends MySqlPreparedQueryConfig = MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): MySqlPreparedQuery<T>;
  query(query: string, params: unknown[]): Promise<ExecutedQuery>;
  queryObjects(query: string, params: unknown[]): Promise<ExecutedQuery>;
  all<T = unknown>(query: SQL): Promise<T[]>;
  count(sql: SQL): Promise<number>;
  transaction<T>(transaction: (tx: PlanetScaleTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare class PlanetScaleTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends MySqlTransaction<PlanetscaleQueryResultHKT, PlanetScalePreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  constructor(dialect: MySqlDialect, session: MySqlSession, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, nestedIndex?: number);
  transaction<T>(transaction: (tx: PlanetScaleTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface PlanetscaleQueryResultHKT extends MySqlQueryResultHKT {
  type: ExecutedQuery;
}
interface PlanetScalePreparedQueryHKT extends MySqlPreparedQueryHKT {
  type: PlanetScalePreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
//#endregion
export { PlanetScalePreparedQuery, PlanetScalePreparedQueryHKT, PlanetScaleTransaction, PlanetscaleQueryResultHKT, PlanetscaleSession, PlanetscaleSessionOptions };
//# sourceMappingURL=session.d.ts.map