import { entityKind } from "../../entity.cjs";
import { Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { PreparedQuery } from "../../session.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";

//#region src/cockroach-core/query-builders/raw.d.ts
interface CockroachRaw<TResult> extends QueryPromise<TResult>, RunnableQuery<TResult, 'cockroach'>, SQLWrapper {}
declare class CockroachRaw<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'cockroach'>, SQLWrapper, PreparedQuery {
  execute: () => Promise<TResult>;
  private sql;
  private query;
  private mapBatchResult;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'cockroach';
    readonly result: TResult;
  };
  constructor(execute: () => Promise<TResult>, sql: SQL, query: Query, mapBatchResult: (result: unknown) => unknown);
  getQuery(): Query;
  mapResult(result: unknown, isFromBatch?: boolean): unknown;
  _prepare(): PreparedQuery;
}
//#endregion
export { CockroachRaw };
//# sourceMappingURL=raw.d.cts.map