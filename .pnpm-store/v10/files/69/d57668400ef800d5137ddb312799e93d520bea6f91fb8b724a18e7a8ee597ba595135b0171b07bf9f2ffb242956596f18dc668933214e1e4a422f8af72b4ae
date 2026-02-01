import { entityKind } from "../../entity.cjs";
import { Query, SQLWrapper } from "../../sql/sql.cjs";
import { PgMaterializedView } from "../view.cjs";
import { PgDialect } from "../dialect.cjs";
import { PgQueryResultHKT, PgQueryResultKind, PgSession } from "../session.cjs";

//#region src/pg-core/query-builders/refresh-materialized-view.d.ts
declare class PgRefreshMaterializedView<TQueryResult extends PgQueryResultHKT> implements SQLWrapper {
  protected session: PgSession;
  protected dialect: PgDialect;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'pg';
    readonly result: PgQueryResultKind<TQueryResult, never>;
  };
  protected config: {
    view: PgMaterializedView;
    concurrently?: boolean;
    withNoData?: boolean;
  };
  constructor(view: PgMaterializedView, session: PgSession, dialect: PgDialect);
  concurrently(): this;
  withNoData(): this;
  toSQL(): Query;
}
//#endregion
export { PgRefreshMaterializedView };
//# sourceMappingURL=refresh-materialized-view.d.cts.map