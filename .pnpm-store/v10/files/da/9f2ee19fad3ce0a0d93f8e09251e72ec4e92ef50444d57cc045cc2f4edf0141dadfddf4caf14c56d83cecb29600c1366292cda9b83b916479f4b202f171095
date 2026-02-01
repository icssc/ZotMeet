import { PgTable } from "../table.cjs";
import { PgViewBase } from "../view-base.cjs";
import { PgDialect } from "../dialect.cjs";
import { PgCountBuilder } from "../query-builders/count.cjs";
import { PgAsyncSession } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { SQL, SQLWrapper } from "../../sql/sql.cjs";
import { QueryPromise } from "../../query-promise.cjs";

//#region src/pg-core/async/count.d.ts
interface PgAsyncCountBuilder extends PgCountBuilder, QueryPromise<number> {}
declare class PgAsyncCountBuilder extends PgCountBuilder {
  static readonly [entityKind]: string;
  protected session: PgAsyncSession;
  constructor({
    source,
    dialect,
    filters,
    session
  }: {
    source: PgTable | PgViewBase | SQL | SQLWrapper;
    filters?: SQL<unknown>;
    dialect: PgDialect;
    session: PgAsyncSession;
  });
  execute(placeholderValues?: Record<string, unknown>): Promise<number>;
}
//#endregion
export { PgAsyncCountBuilder };
//# sourceMappingURL=count.d.cts.map