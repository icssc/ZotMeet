import { GelDialect } from "./dialect.cjs";
import { GelDatabase } from "./db.cjs";
import { SelectedFieldsOrdered } from "./query-builders/select.types.cjs";
import { entityKind } from "../entity.cjs";
import { NeonAuthToken } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { PreparedQuery } from "../session.cjs";
import { Query, SQL } from "../sql/index.cjs";
import { Cache } from "../cache/core/cache.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";

//#region src/gel-core/session.d.ts
interface PreparedQueryConfig {
  execute: unknown;
  all: unknown;
  values: unknown;
}
declare abstract class GelPreparedQuery<T extends PreparedQueryConfig> implements PreparedQuery {
  protected query: Query;
  private cache?;
  private queryMetadata?;
  private cacheConfig?;
  constructor(query: Query, cache?: Cache | undefined, queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig?: WithCacheConfig | undefined);
  protected authToken?: NeonAuthToken;
  getQuery(): Query;
  mapResult(response: unknown, _isFromBatch?: boolean): unknown;
  static readonly [entityKind]: string;
  abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
}
declare abstract class GelSession<TQueryResult extends GelQueryResultHKT = any,
// TO
TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = Record<string, never>> {
  protected dialect: GelDialect;
  static readonly [entityKind]: string;
  constructor(dialect: GelDialect);
  abstract prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): GelPreparedQuery<T>;
  abstract prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper?: (rows: Record<string, unknown>[], mapColumnValue?: (value: unknown) => unknown) => T['execute']): GelPreparedQuery<T>;
  execute<T>(query: SQL): Promise<T>;
  all<T = unknown>(query: SQL): Promise<T[]>;
  count(sql: SQL): Promise<number>;
  abstract transaction<T>(transaction: (tx: GelTransaction<TQueryResult, TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare abstract class GelTransaction<TQueryResult extends GelQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = Record<string, never>> extends GelDatabase<TQueryResult, TFullSchema, TRelations, TSchema> {
  protected relations: TRelations;
  protected schema: {
    fullSchema: Record<string, unknown>;
    schema: TSchema;
    tableNamesMap: Record<string, string>;
  } | undefined;
  static readonly [entityKind]: string;
  constructor(dialect: GelDialect, session: GelSession<any, any, any, any>, relations: TRelations, schema: {
    fullSchema: Record<string, unknown>;
    schema: TSchema;
    tableNamesMap: Record<string, string>;
  } | undefined);
  rollback(): never;
  abstract transaction<T>(transaction: (tx: GelTransaction<TQueryResult, TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
interface GelQueryResultHKT {
  readonly $brand: 'GelQueryResultHKT';
  readonly row: unknown;
  readonly type: unknown;
}
type GelQueryResultKind<TKind extends GelQueryResultHKT, TRow> = (TKind & {
  readonly row: TRow;
})['type'];
//#endregion
export { GelPreparedQuery, GelQueryResultHKT, GelQueryResultKind, GelSession, GelTransaction, PreparedQueryConfig };
//# sourceMappingURL=session.d.cts.map