import { PgRefreshMaterializedView } from "../query-builders/refresh-materialized-view.js";
import { PgAsyncPreparedQuery, PgAsyncSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import { RunnableQuery } from "../../runnable-query.js";
import { PgQueryResultHKT, PgQueryResultKind, PreparedQueryConfig } from "../session.js";

//#region src/pg-core/async/refresh-materialized-view.d.ts
interface PgAsyncRefreshMaterializedView<TQueryResult extends PgQueryResultHKT> extends QueryPromise<PgQueryResultKind<TQueryResult, never>> {}
declare class PgAsyncRefreshMaterializedView<TQueryResult extends PgQueryResultHKT> extends PgRefreshMaterializedView<TQueryResult> implements RunnableQuery<PgQueryResultKind<TQueryResult, never>, 'pg'> {
  static readonly [entityKind]: string;
  protected session: PgAsyncSession;
  prepare(name: string): PgAsyncPreparedQuery<PreparedQueryConfig & {
    execute: PgQueryResultKind<TQueryResult, never>;
  }>;
  execute: ReturnType<this['prepare']>['execute'];
}
//#endregion
export { PgAsyncRefreshMaterializedView };
//# sourceMappingURL=refresh-materialized-view.d.ts.map