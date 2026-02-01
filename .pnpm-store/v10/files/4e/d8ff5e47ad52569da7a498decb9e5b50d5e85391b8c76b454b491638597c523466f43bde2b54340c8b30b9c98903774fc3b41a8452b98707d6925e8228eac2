import { PgSelectBuilder } from "./select.js";
import { SelectedFields } from "./select.types.js";
import "../columns/index.js";
import { PgColumn } from "../columns/common.js";
import { WithBuilder } from "../subquery.js";
import { entityKind } from "../../entity.js";
import { WithSubquery } from "../../subquery.js";
import { SQLWrapper } from "../../sql/sql.js";
import { PgDialect, PgDialectConfig } from "../dialect.js";

//#region src/pg-core/query-builders/query-builder.d.ts
declare class QueryBuilder {
  static readonly [entityKind]: string;
  private dialect;
  private dialectConfig;
  constructor(dialect?: PgDialect | PgDialectConfig);
  $with: WithBuilder;
  with(...queries: WithSubquery[]): {
    select: {
      (): PgSelectBuilder<undefined>;
      <TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection>;
    };
    selectDistinct: {
      (): PgSelectBuilder<undefined>;
      <TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection>;
    };
    selectDistinctOn: {
      (on: (PgColumn | SQLWrapper)[]): PgSelectBuilder<undefined>;
      <TSelection extends SelectedFields>(on: (PgColumn | SQLWrapper)[], fields: TSelection): PgSelectBuilder<TSelection>;
    };
  };
  select(): PgSelectBuilder<undefined>;
  select<TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection>;
  selectDistinct(): PgSelectBuilder<undefined>;
  selectDistinct<TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection>;
  selectDistinctOn(on: (PgColumn | SQLWrapper)[]): PgSelectBuilder<undefined>;
  selectDistinctOn<TSelection extends SelectedFields>(on: (PgColumn | SQLWrapper)[], fields: TSelection): PgSelectBuilder<TSelection>;
  private getDialect;
}
//#endregion
export { QueryBuilder };
//# sourceMappingURL=query-builder.d.ts.map