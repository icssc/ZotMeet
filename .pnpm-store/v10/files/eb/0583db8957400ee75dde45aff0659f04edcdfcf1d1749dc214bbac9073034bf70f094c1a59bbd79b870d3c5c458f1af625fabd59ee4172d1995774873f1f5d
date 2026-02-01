import { PgTable } from "../table.js";
import { PgViewBase } from "../view-base.js";
import { PgDialect } from "../dialect.js";
import { entityKind } from "../../entity.js";
import { QueryWithTypings, SQL, SQLWrapper } from "../../sql/sql.js";

//#region src/pg-core/query-builders/count.d.ts
declare class PgCountBuilder extends SQL<number> implements SQLWrapper<number> {
  protected countConfig: {
    source: PgTable | PgViewBase | SQL | SQLWrapper;
    filters?: SQL<unknown>;
    dialect: PgDialect;
  };
  static readonly [entityKind]: string;
  private dialect;
  private static buildEmbeddedCount;
  constructor(countConfig: {
    source: PgTable | PgViewBase | SQL | SQLWrapper;
    filters?: SQL<unknown>;
    dialect: PgDialect;
  });
  protected build(): QueryWithTypings;
}
//#endregion
export { PgCountBuilder };
//# sourceMappingURL=count.d.ts.map