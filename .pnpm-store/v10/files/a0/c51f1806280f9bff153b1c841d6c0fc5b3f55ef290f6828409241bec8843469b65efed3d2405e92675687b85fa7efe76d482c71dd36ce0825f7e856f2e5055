import { PgRaw } from "../query-builders/raw.js";
import { entityKind } from "../../entity.js";
import { Query, SQL, SQLWrapper } from "../../sql/sql.js";
import { QueryPromise } from "../../query-promise.js";
import { PreparedQuery } from "../../session.js";
import { RunnableQuery } from "../../runnable-query.js";

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
//# sourceMappingURL=raw.d.ts.map