import { CockroachColumn } from "../columns/common.cjs";
import "../columns/index.cjs";
import { WithBuilder } from "../subquery.cjs";
import { CockroachSelectBuilder } from "./select.cjs";
import { SelectedFields } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { SQLWrapper } from "../../sql/sql.cjs";
import { WithSubquery } from "../../subquery.cjs";
import { CockroachDialect, CockroachDialectConfig } from "../dialect.cjs";

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
//# sourceMappingURL=query-builder.d.cts.map