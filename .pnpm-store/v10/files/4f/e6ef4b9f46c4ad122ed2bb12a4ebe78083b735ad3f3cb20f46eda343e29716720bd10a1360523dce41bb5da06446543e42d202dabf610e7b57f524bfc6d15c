import { CockroachDialect } from "./dialect.js";
import { CockroachDatabase } from "./db.js";
import { SelectedFieldsOrdered } from "./query-builders/select.types.js";
import { entityKind } from "../entity.js";
import { NeonAuthToken } from "../utils.js";
import * as V1 from "../_relations.js";
import { Query, SQL } from "../sql/index.js";
import { PreparedQuery } from "../session.js";

//#region src/cockroach-core/session.d.ts
interface PreparedQueryConfig {
  execute: unknown;
  all: unknown;
  values: unknown;
}
declare abstract class CockroachPreparedQuery<T extends PreparedQueryConfig> implements PreparedQuery {
  protected query: Query;
  constructor(query: Query);
  protected authToken?: NeonAuthToken;
  getQuery(): Query;
  mapResult(response: unknown, _isFromBatch?: boolean): unknown;
  static readonly [entityKind]: string;
  abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
}
interface CockroachTransactionConfig {
  isolationLevel?: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable';
  accessMode?: 'read only' | 'read write';
  deferrable?: boolean;
}
declare abstract class CockroachSession<TQueryResult extends CockroachQueryResultHKT = CockroachQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends V1.TablesRelationalConfig = Record<string, never>> {
  protected dialect: CockroachDialect;
  static readonly [entityKind]: string;
  constructor(dialect: CockroachDialect);
  abstract prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => T['execute']): CockroachPreparedQuery<T>;
  execute<T>(query: SQL): Promise<T>;
  all<T = unknown>(query: SQL): Promise<T[]>;
  count(sql: SQL): Promise<number>;
  abstract transaction<T>(transaction: (tx: CockroachTransaction<TQueryResult, TFullSchema, TSchema>) => Promise<T>, config?: CockroachTransactionConfig): Promise<T>;
}
declare abstract class CockroachTransaction<TQueryResult extends CockroachQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends V1.TablesRelationalConfig = Record<string, never>> extends CockroachDatabase<TQueryResult, TFullSchema, TSchema> {
  protected schema: {
    fullSchema: Record<string, unknown>;
    schema: TSchema;
    tableNamesMap: Record<string, string>;
  } | undefined;
  protected readonly nestedIndex: number;
  static readonly [entityKind]: string;
  constructor(dialect: CockroachDialect, session: CockroachSession<any, any, any>, schema: {
    fullSchema: Record<string, unknown>;
    schema: TSchema;
    tableNamesMap: Record<string, string>;
  } | undefined, nestedIndex?: number);
  rollback(): never;
  setTransaction(config: CockroachTransactionConfig): Promise<void>;
  abstract transaction<T>(transaction: (tx: CockroachTransaction<TQueryResult, TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
interface CockroachQueryResultHKT {
  readonly $brand: 'CockroachQueryResultHKT';
  readonly row: unknown;
  readonly type: unknown;
}
type CockroachQueryResultKind<TKind extends CockroachQueryResultHKT, TRow> = (TKind & {
  readonly row: TRow;
})['type'];
//#endregion
export { CockroachPreparedQuery, CockroachQueryResultHKT, CockroachQueryResultKind, CockroachSession, CockroachTransaction, CockroachTransactionConfig, PreparedQueryConfig };
//# sourceMappingURL=session.d.ts.map