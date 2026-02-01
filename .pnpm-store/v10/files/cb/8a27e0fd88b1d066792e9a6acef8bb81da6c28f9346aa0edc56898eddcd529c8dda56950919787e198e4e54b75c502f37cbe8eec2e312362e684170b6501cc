import { PgRefreshMaterializedView } from "../query-builders/refresh-materialized-view.js";
import { PgEffectPreparedQuery, PgEffectSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { QueryEffect } from "../../effect-core/query-effect.js";
import { RunnableQuery } from "../../runnable-query.js";
import { PgQueryResultHKT, PgQueryResultKind, PreparedQueryConfig } from "../session.js";

//#region src/pg-core/effect/refresh-materialized-view.d.ts
interface PgEffectRefreshMaterializedView<TQueryResult extends PgQueryResultHKT> extends QueryEffect<PgQueryResultKind<TQueryResult, never>> {}
declare class PgEffectRefreshMaterializedView<TQueryResult extends PgQueryResultHKT> extends PgRefreshMaterializedView<TQueryResult> implements RunnableQuery<PgQueryResultKind<TQueryResult, never>, 'pg'> {
  static readonly [entityKind]: string;
  protected session: PgEffectSession;
  prepare(name: string): PgEffectPreparedQuery<PreparedQueryConfig & {
    execute: PgQueryResultKind<TQueryResult, never>;
  }>;
  execute: ReturnType<this['prepare']>['execute'];
}
//#endregion
export { PgEffectRefreshMaterializedView };
//# sourceMappingURL=refresh-materialized-view.d.ts.map