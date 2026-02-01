import { MsSqlDialect } from "./dialect.cjs";
import { MsSqlDatabase } from "./db.cjs";
import { SelectedFieldsOrdered } from "./query-builders/select.types.cjs";
import { entityKind } from "../entity.cjs";
import { Query, SQL } from "../sql/sql.cjs";
import { Assume, Equal } from "../utils.cjs";
import * as V1 from "../_relations.cjs";

//#region src/mssql-core/session.d.ts
interface QueryResultHKT {
  readonly $brand: 'MsSqlQueryRowHKT';
  readonly row: unknown;
  readonly type: unknown;
}
interface AnyQueryResultHKT extends QueryResultHKT {
  readonly type: any;
}
type QueryResultKind<TKind extends QueryResultHKT, TRow> = (TKind & {
  readonly row: TRow;
})['type'];
interface PreparedQueryConfig {
  execute: unknown;
  iterator: unknown;
}
interface PreparedQueryHKT {
  readonly $brand: 'MsSqlPreparedQueryHKT';
  readonly config: unknown;
  readonly type: unknown;
}
type PreparedQueryKind<TKind extends PreparedQueryHKT, TConfig extends PreparedQueryConfig, TAssume extends boolean = false> = Equal<TAssume, true> extends true ? Assume<(TKind & {
  readonly config: TConfig;
})['type'], PreparedQuery<TConfig>> : (TKind & {
  readonly config: TConfig;
})['type'];
declare abstract class PreparedQuery<T extends PreparedQueryConfig> {
  static readonly [entityKind]: string;
  abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
  abstract iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
interface MsSqlTransactionConfig {
  isolationLevel: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable' | 'snapshot';
}
declare abstract class MsSqlSession<TQueryResult extends QueryResultHKT = QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends V1.TablesRelationalConfig = Record<string, never>> {
  protected dialect: MsSqlDialect;
  static readonly [entityKind]: string;
  constructor(dialect: MsSqlDialect);
  abstract prepareQuery<T extends PreparedQueryConfig, TPreparedQueryHKT extends PreparedQueryHKT>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute']): PreparedQueryKind<TPreparedQueryHKT, T>;
  execute<T>(query: SQL): Promise<T>;
  abstract all<T = unknown>(query: SQL): Promise<T[]>;
  abstract transaction<T>(transaction: (tx: MsSqlTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema>) => Promise<T>, config?: MsSqlTransactionConfig): Promise<T>;
  protected getSetTransactionSQL(config: MsSqlTransactionConfig): SQL | undefined;
  protected getStartTransactionSQL(_config: MsSqlTransactionConfig): SQL | undefined;
}
declare abstract class MsSqlTransaction<TQueryResult extends QueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends V1.TablesRelationalConfig = Record<string, never>> extends MsSqlDatabase<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema> {
  protected schema: V1.RelationalSchemaConfig<TSchema> | undefined;
  protected readonly nestedIndex: number;
  static readonly [entityKind]: string;
  constructor(dialect: MsSqlDialect, session: MsSqlSession, schema: V1.RelationalSchemaConfig<TSchema> | undefined, nestedIndex: number);
  rollback(): never;
  /** Nested transactions (aka savepoints) only work with InnoDB engine. */
  abstract transaction<T>(transaction: (tx: MsSqlTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
interface PreparedQueryHKTBase extends PreparedQueryHKT {
  type: PreparedQuery<Assume<this['config'], PreparedQueryConfig>>;
}
//#endregion
export { AnyQueryResultHKT, MsSqlSession, MsSqlTransaction, MsSqlTransactionConfig, PreparedQuery, PreparedQueryConfig, PreparedQueryHKT, PreparedQueryHKTBase, PreparedQueryKind, QueryResultHKT, QueryResultKind };
//# sourceMappingURL=session.d.cts.map