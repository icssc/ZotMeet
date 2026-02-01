import { SQLiteAsyncDialect } from "../dialect.cjs";
import { entityKind } from "../../entity.cjs";
import * as __sql_sql_ts2 from "../../sql/sql.cjs";
import { SQL, SQLWrapper } from "../../sql/sql.cjs";
import { PreparedQuery } from "../../session.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";

//#region src/sqlite-core/query-builders/raw.d.ts
type SQLiteRawAction = 'all' | 'get' | 'values' | 'run';
interface SQLiteRawConfig {
  action: SQLiteRawAction;
}
interface SQLiteRaw<TResult> extends QueryPromise<TResult>, RunnableQuery<TResult, 'sqlite'>, SQLWrapper {}
declare class SQLiteRaw<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'sqlite'>, SQLWrapper, PreparedQuery {
  execute: () => Promise<TResult>;
  private dialect;
  private mapBatchResult;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'sqlite';
    readonly result: TResult;
  };
  constructor(execute: () => Promise<TResult>, /** @internal */
  getSQL: () => SQL, action: SQLiteRawAction, dialect: SQLiteAsyncDialect, mapBatchResult: (result: unknown) => unknown);
  getQuery(): {
    method: SQLiteRawAction;
    typings?: __sql_sql_ts2.QueryTypingsValue[];
    sql: string;
    params: unknown[];
  };
  mapResult(result: unknown, isFromBatch?: boolean): unknown;
  _prepare(): PreparedQuery;
}
//#endregion
export { SQLiteRaw, SQLiteRawConfig };
//# sourceMappingURL=raw.d.cts.map