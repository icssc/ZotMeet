import { entityKind } from "../../entity.js";
import { Query, SQLWrapper } from "../../sql/sql.js";
import { QueryPromise } from "../../query-promise.js";
import { CockroachDialect } from "../dialect.js";
import { CockroachPreparedQuery, CockroachQueryResultHKT, CockroachQueryResultKind, CockroachSession, PreparedQueryConfig } from "../session.js";
import { CockroachMaterializedView } from "../view.js";
import { RunnableQuery } from "../../runnable-query.js";

//#region src/cockroach-core/query-builders/refresh-materialized-view.d.ts
interface CockroachRefreshMaterializedView<TQueryResult extends CockroachQueryResultHKT> extends QueryPromise<CockroachQueryResultKind<TQueryResult, never>>, RunnableQuery<CockroachQueryResultKind<TQueryResult, never>, 'cockroach'>, SQLWrapper {
  readonly _: {
    readonly dialect: 'cockroach';
    readonly result: CockroachQueryResultKind<TQueryResult, never>;
  };
}
declare class CockroachRefreshMaterializedView<TQueryResult extends CockroachQueryResultHKT> extends QueryPromise<CockroachQueryResultKind<TQueryResult, never>> implements RunnableQuery<CockroachQueryResultKind<TQueryResult, never>, 'cockroach'>, SQLWrapper {
  private session;
  private dialect;
  static readonly [entityKind]: string;
  private config;
  constructor(view: CockroachMaterializedView, session: CockroachSession, dialect: CockroachDialect);
  concurrently(): this;
  withNoData(): this;
  toSQL(): Query;
  prepare(name: string): CockroachPreparedQuery<PreparedQueryConfig & {
    execute: CockroachQueryResultKind<TQueryResult, never>;
  }>;
  private authToken?;
  execute: ReturnType<this['prepare']>['execute'];
}
//#endregion
export { CockroachRefreshMaterializedView };
//# sourceMappingURL=refresh-materialized-view.d.ts.map