import { PgSelectBuilder } from "./select.cjs";
import { SelectedFields } from "./select.types.cjs";
import "../columns/index.cjs";
import { PgColumn } from "../columns/common.cjs";
import { WithBuilder } from "../subquery.cjs";
import { entityKind } from "../../entity.cjs";
import { SQLWrapper } from "../../sql/sql.cjs";
import { WithSubquery } from "../../subquery.cjs";
import { PgDialect, PgDialectConfig } from "../dialect.cjs";

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
//# sourceMappingURL=query-builder.d.cts.map