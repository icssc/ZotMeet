import { entityKind } from "../../entity.cjs";
import { Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { PreparedQuery } from "../../session.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";

//#region src/gel-core/query-builders/raw.d.ts
interface GelRaw<TResult> extends QueryPromise<TResult>, RunnableQuery<TResult, 'gel'>, SQLWrapper {}
declare class GelRaw<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'gel'>, SQLWrapper, PreparedQuery {
  execute: () => Promise<TResult>;
  private sql;
  private query;
  private mapBatchResult;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'gel';
    readonly result: TResult;
  };
  constructor(execute: () => Promise<TResult>, sql: SQL, query: Query, mapBatchResult: (result: unknown) => unknown);
  getQuery(): Query;
  mapResult(result: unknown, isFromBatch?: boolean): unknown;
  _prepare(): PreparedQuery;
}
//#endregion
export { GelRaw };
//# sourceMappingURL=raw.d.cts.map