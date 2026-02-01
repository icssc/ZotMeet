import { SelectedFieldsOrdered } from "../query-builders/select.types.cjs";
import { PgDialect } from "../dialect.cjs";
import { PgBasePreparedQuery, PgQueryResultHKT, PgSession, PgTransactionConfig, PreparedQueryConfig } from "../session.cjs";
import { PgAsyncDatabase } from "./db.cjs";
import { entityKind } from "../../entity.cjs";
import { Query, SQL } from "../../sql/sql.cjs";
import * as V1 from "../../_relations.cjs";
import { MigrationConfig, MigrationMeta, MigratorInitFailResponse } from "../../migrator.cjs";
import { Cache } from "../../cache/core/cache.cjs";
import { WithCacheConfig } from "../../cache/core/types.cjs";
import { AnyRelations, EmptyRelations } from "../../relations.cjs";

//#region src/pg-core/async/session.d.ts
declare abstract class PgAsyncPreparedQuery<T extends PreparedQueryConfig> extends PgBasePreparedQuery {
  private cache;
  private queryMetadata;
  private cacheConfig?;
  static readonly [entityKind]: string;
  constructor(query: Query, cache: Cache | undefined, queryMetadata: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  } | undefined, cacheConfig?: WithCacheConfig | undefined);
  abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
}
declare abstract class PgAsyncSession<TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = V1.ExtractTablesWithRelations<TFullSchema>> extends PgSession {
  static readonly [entityKind]: string;
  constructor(dialect: PgDialect);
  abstract prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PgAsyncPreparedQuery<T>;
  abstract prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper: (rows: Record<string, unknown>[], mapColumnValue?: (value: unknown) => unknown) => T['execute']): PgAsyncPreparedQuery<T>;
  execute<T>(query: SQL): Promise<T>;
  all<T = unknown>(query: SQL): Promise<T[]>;
  abstract transaction<T>(transaction: (tx: PgAsyncTransaction<TQueryResult, TFullSchema, TRelations, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
declare abstract class PgAsyncTransaction<TQueryResult extends PgQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TSchema extends V1.TablesRelationalConfig = V1.ExtractTablesWithRelations<TFullSchema>> extends PgAsyncDatabase<TQueryResult, TFullSchema, TRelations, TSchema> {
  protected relations: TRelations;
  protected schema: {
    fullSchema: Record<string, unknown>;
    schema: TSchema;
    tableNamesMap: Record<string, string>;
  } | undefined;
  protected readonly nestedIndex: number;
  static readonly [entityKind]: string;
  constructor(dialect: PgDialect, session: PgAsyncSession<any, any, any, any>, relations: TRelations, schema: {
    fullSchema: Record<string, unknown>;
    schema: TSchema;
    tableNamesMap: Record<string, string>;
  } | undefined, nestedIndex?: number, parseRqbJson?: boolean);
  rollback(): never;
  setTransaction(config: PgTransactionConfig): Promise<void>;
  abstract transaction<T>(transaction: (tx: PgAsyncTransaction<TQueryResult, TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare function migrate(migrations: MigrationMeta[], session: PgAsyncSession, config: string | MigrationConfig): Promise<void | MigratorInitFailResponse>;
//#endregion
export { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction, migrate };
//# sourceMappingURL=session.d.cts.map