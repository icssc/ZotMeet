import { entityKind } from "../entity.js";
import { Query, SQL } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { Cache } from "../cache/core/index.js";
import { Client } from "gel";
import { GelDialect } from "../gel-core/dialect.js";
import { GelPreparedQuery, GelSession, GelTransaction, PreparedQueryConfig } from "../gel-core/session.js";
import { AnyRelations } from "../relations.js";
import { WithCacheConfig } from "../cache/core/types.js";
import { SelectedFieldsOrdered } from "../gel-core/query-builders/select.types.js";
import { Transaction } from "gel/dist/transaction";

//#region src/gel/session.d.ts
type GelClient = Client | Transaction;
declare class GelDbPreparedQuery<T extends PreparedQueryConfig, TIsRqbV2 extends boolean = false> extends GelPreparedQuery<T> {
  private client;
  private queryString;
  private params;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private transaction;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: GelClient, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, transaction?: boolean, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  executeRqbV2(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
interface GelSessionOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class GelDbSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends GelSession<GelQueryResultHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  private cache;
  constructor(client: GelClient, dialect: GelDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: GelSessionOptions);
  prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): GelDbPreparedQuery<T>;
  prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper?: (rows: Record<string, unknown>[]) => T['execute']): GelDbPreparedQuery<T, true>;
  transaction<T>(transaction: (tx: GelTransaction<GelQueryResultHKT, TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
  count(sql: SQL): Promise<number>;
}
declare class GelDbTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends GelTransaction<GelQueryResultHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: GelDbTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface GelQueryResultHKT {
  readonly $brand: 'GelQueryResultHKT';
  readonly row: unknown;
  readonly type: unknown;
}
//#endregion
export { GelClient, GelDbPreparedQuery, GelDbSession, GelDbTransaction, GelQueryResultHKT, GelSessionOptions };
//# sourceMappingURL=session.d.ts.map