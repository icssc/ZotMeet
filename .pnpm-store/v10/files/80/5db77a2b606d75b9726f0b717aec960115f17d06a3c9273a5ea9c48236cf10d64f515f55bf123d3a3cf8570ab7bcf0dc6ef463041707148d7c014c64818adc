import { PgTable } from "../table.js";
import { PgViewBase } from "../view-base.js";
import { PgDialect } from "../dialect.js";
import { PgCountBuilder } from "../query-builders/count.js";
import { PgAsyncSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { SQL, SQLWrapper } from "../../sql/sql.js";
import { QueryPromise } from "../../query-promise.js";

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
//# sourceMappingURL=count.d.ts.map