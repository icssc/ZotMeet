import { entityKind } from "../../entity.js";
import { Query, SQLWrapper } from "../../sql/sql.js";
import { GelDialect } from "../dialect.js";
import { GelPreparedQuery, GelQueryResultHKT, GelQueryResultKind, GelSession, PreparedQueryConfig } from "../session.js";
import { QueryPromise } from "../../query-promise.js";
import { RunnableQuery } from "../../runnable-query.js";
import { GelMaterializedView } from "../view.js";

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
//# sourceMappingURL=refresh-materialized-view.d.ts.map