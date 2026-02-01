import { entityKind } from "../../entity.cjs";
import { Query, SQLWrapper } from "../../sql/sql.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";
import { GelMaterializedView } from "../view.cjs";
import { GelDialect } from "../dialect.cjs";
import { GelPreparedQuery, GelQueryResultHKT, GelQueryResultKind, GelSession, PreparedQueryConfig } from "../session.cjs";

//#region src/gel-core/query-builders/refresh-materialized-view.d.ts
interface GelRefreshMaterializedView<TQueryResult extends GelQueryResultHKT> extends QueryPromise<GelQueryResultKind<TQueryResult, never>>, RunnableQuery<GelQueryResultKind<TQueryResult, never>, 'gel'>, SQLWrapper {
  readonly _: {
    readonly dialect: 'gel';
    readonly result: GelQueryResultKind<TQueryResult, never>;
  };
}
declare class GelRefreshMaterializedView<TQueryResult extends GelQueryResultHKT> extends QueryPromise<GelQueryResultKind<TQueryResult, never>> implements RunnableQuery<GelQueryResultKind<TQueryResult, never>, 'gel'>, SQLWrapper {
  private session;
  private dialect;
  static readonly [entityKind]: string;
  private config;
  constructor(view: GelMaterializedView, session: GelSession, dialect: GelDialect);
  concurrently(): this;
  withNoData(): this;
  toSQL(): Query;
  prepare(name: string): GelPreparedQuery<PreparedQueryConfig & {
    execute: GelQueryResultKind<TQueryResult, never>;
  }>;
  execute: ReturnType<this['prepare']>['execute'];
}
//#endregion
export { GelRefreshMaterializedView };
//# sourceMappingURL=refresh-materialized-view.d.cts.map