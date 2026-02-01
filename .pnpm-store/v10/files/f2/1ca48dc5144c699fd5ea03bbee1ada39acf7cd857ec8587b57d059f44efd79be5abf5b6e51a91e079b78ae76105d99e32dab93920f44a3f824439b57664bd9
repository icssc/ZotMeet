import { PgRefreshMaterializedView } from "../query-builders/refresh-materialized-view.cjs";
import { PgEffectPreparedQuery, PgEffectSession } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";
import { PgQueryResultHKT, PgQueryResultKind, PreparedQueryConfig } from "../session.cjs";
import { QueryEffect } from "../../effect-core/query-effect.cjs";

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
//# sourceMappingURL=refresh-materialized-view.d.cts.map