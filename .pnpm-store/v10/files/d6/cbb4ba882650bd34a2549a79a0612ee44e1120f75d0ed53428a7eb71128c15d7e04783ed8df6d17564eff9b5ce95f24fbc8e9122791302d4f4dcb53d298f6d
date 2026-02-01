import { PgTable } from "../table.cjs";
import { PgViewBase } from "../view-base.cjs";
import { PgDialect } from "../dialect.cjs";
import { entityKind } from "../../entity.cjs";
import { QueryWithTypings, SQL, SQLWrapper } from "../../sql/sql.cjs";

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
//# sourceMappingURL=count.d.cts.map