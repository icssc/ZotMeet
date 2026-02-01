import { SelectedFieldsOrdered } from "./query-builders/select.types.cjs";
import { PgDialect } from "./dialect.cjs";
import { entityKind } from "../entity.cjs";
import { PreparedQuery } from "../session.cjs";
import { Query, SQL } from "../sql/index.cjs";
import { WithCacheConfig } from "../cache/core/types.cjs";

//#region src/pg-core/session.d.ts
interface PreparedQueryConfig {
  execute: unknown;
  all: unknown;
  values: unknown;
}
declare abstract class PgBasePreparedQuery implements PreparedQuery {
  protected query: Query;
  static readonly [entityKind]: string;
  constructor(query: Query);
  getQuery(): Query;
  mapResult(response: unknown, _isFromBatch?: boolean): unknown;
  abstract execute(placeholderValues?: Record<string, unknown>): unknown;
}
interface PgTransactionConfig {
  isolationLevel?: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable';
  accessMode?: 'read only' | 'read write';
  deferrable?: boolean;
}
declare abstract class PgSession {
  protected dialect: PgDialect;
  static readonly [entityKind]: string;
  constructor(dialect: PgDialect);
  abstract prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => T['execute'], queryMetadata?: {
    type: 'select' | 'update' | 'delete' | 'insert';
    tables: string[];
  }, cacheConfig?: WithCacheConfig): PgBasePreparedQuery;
  abstract prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, customResultMapper: (rows: Record<string, unknown>[], mapColumnValue?: (value: unknown) => unknown) => T['execute']): PgBasePreparedQuery;
  abstract execute(query: SQL): unknown;
  abstract all(query: SQL): unknown;
}
interface PgQueryResultHKT {
  readonly $brand: 'PgQueryResultHKT';
  readonly row: unknown;
  readonly type: unknown;
}
type PgQueryResultKind<TKind extends PgQueryResultHKT, TRow> = (TKind & {
  readonly row: TRow;
})['type'];
//#endregion
export { PgBasePreparedQuery, PgQueryResultHKT, PgQueryResultKind, PgSession, PgTransactionConfig, PreparedQueryConfig };
//# sourceMappingURL=session.d.cts.map