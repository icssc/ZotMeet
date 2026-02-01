import { entityKind } from "../../entity.js";
import { Query, SQL, SQLWrapper } from "../../sql/sql.js";
import { PreparedQuery } from "../../session.js";

//#region src/pg-core/query-builders/raw.d.ts
interface PgRaw<TResult> extends SQLWrapper {}
declare class PgRaw<TResult> implements SQLWrapper, PreparedQuery {
  protected sql: SQL;
  protected query: Query;
  protected mapBatchResult: (result: unknown) => unknown;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'pg';
    readonly result: TResult;
  };
  constructor(sql: SQL, query: Query, mapBatchResult: (result: unknown) => unknown);
  getQuery(): Query;
  mapResult(result: unknown, isFromBatch?: boolean): unknown;
}
//#endregion
export { PgRaw };
//# sourceMappingURL=raw.d.ts.map