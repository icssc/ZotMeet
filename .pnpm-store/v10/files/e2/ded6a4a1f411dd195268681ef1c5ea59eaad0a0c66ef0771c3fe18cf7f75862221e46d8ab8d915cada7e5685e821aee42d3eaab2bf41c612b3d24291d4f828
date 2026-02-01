import { CockroachColumn } from "../columns/common.js";
import "../columns/index.js";
import { WithBuilder } from "../subquery.js";
import { CockroachSelectBuilder } from "./select.js";
import { SelectedFields } from "./select.types.js";
import { entityKind } from "../../entity.js";
import { WithSubquery } from "../../subquery.js";
import { SQLWrapper } from "../../sql/sql.js";
import { CockroachDialect, CockroachDialectConfig } from "../dialect.js";

//#region src/cockroach-core/query-builders/query-builder.d.ts
declare class QueryBuilder {
  static readonly [entityKind]: string;
  private dialect;
  private dialectConfig;
  constructor(dialect?: CockroachDialect | CockroachDialectConfig);
  $with: WithBuilder;
  with(...queries: WithSubquery[]): {
    select: {
      (): CockroachSelectBuilder<undefined, "qb">;
      <TSelection extends SelectedFields>(fields: TSelection): CockroachSelectBuilder<TSelection, "qb">;
    };
    selectDistinct: {
      (): CockroachSelectBuilder<undefined, "qb">;
      <TSelection extends SelectedFields>(fields: TSelection): CockroachSelectBuilder<TSelection, "qb">;
    };
    selectDistinctOn: {
      (on: (CockroachColumn | SQLWrapper)[]): CockroachSelectBuilder<undefined, "qb">;
      <TSelection extends SelectedFields>(on: (CockroachColumn | SQLWrapper)[], fields: TSelection): CockroachSelectBuilder<TSelection, "qb">;
    };
  };
  select(): CockroachSelectBuilder<undefined, 'qb'>;
  select<TSelection extends SelectedFields>(fields: TSelection): CockroachSelectBuilder<TSelection, 'qb'>;
  selectDistinct(): CockroachSelectBuilder<undefined>;
  selectDistinct<TSelection extends SelectedFields>(fields: TSelection): CockroachSelectBuilder<TSelection>;
  selectDistinctOn(on: (CockroachColumn | SQLWrapper)[]): CockroachSelectBuilder<undefined>;
  selectDistinctOn<TSelection extends SelectedFields>(on: (CockroachColumn | SQLWrapper)[], fields: TSelection): CockroachSelectBuilder<TSelection>;
  private getDialect;
}
//#endregion
export { QueryBuilder };
//# sourceMappingURL=query-builder.d.ts.map