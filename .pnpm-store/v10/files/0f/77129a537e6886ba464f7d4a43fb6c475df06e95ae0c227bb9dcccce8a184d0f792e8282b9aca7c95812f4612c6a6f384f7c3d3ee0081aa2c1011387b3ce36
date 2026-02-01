import { PgRaw } from "../query-builders/raw.cjs";
import { entityKind } from "../../entity.cjs";
import { Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import { PreparedQuery } from "../../session.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";

//#region src/pg-core/async/raw.d.ts
interface PgAsyncRaw<TResult> extends QueryPromise<TResult>, RunnableQuery<TResult, 'pg'>, SQLWrapper {}
declare class PgAsyncRaw<TResult> extends PgRaw<TResult> implements RunnableQuery<TResult, 'pg'> {
  execute: () => Promise<TResult>;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'pg';
    readonly result: TResult;
  };
  constructor(execute: () => Promise<TResult>, sql: SQL, query: Query, mapBatchResult: (result: unknown) => unknown);
  _prepare(): PreparedQuery;
}
//#endregion
export { PgAsyncRaw };
//# sourceMappingURL=raw.d.cts.map