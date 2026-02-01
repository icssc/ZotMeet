import { GelColumn } from "../columns/common.js";
import "../columns/index.js";
import { WithSubqueryWithSelection } from "../subquery.js";
import { GelSelectBuilder } from "./select.js";
import { SelectedFields } from "./select.types.js";
import { entityKind } from "../../entity.js";
import { WithSubquery } from "../../subquery.js";
import { ColumnsSelection, SQLWrapper } from "../../sql/sql.js";
import { GelDialect, GelDialectConfig } from "../dialect.js";
import { TypedQueryBuilder } from "../../query-builders/query-builder.js";

//#region src/gel-core/query-builders/query-builder.d.ts
declare class QueryBuilder {
  static readonly [entityKind]: string;
  private dialect;
  private dialectConfig;
  constructor(dialect?: GelDialect | GelDialectConfig);
  $with<TAlias extends string>(alias: TAlias): {
    as<TSelection extends ColumnsSelection>(qb: TypedQueryBuilder<TSelection> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelection>)): WithSubqueryWithSelection<TSelection, TAlias>;
  };
  with(...queries: WithSubquery[]): {
    select: {
      (): GelSelectBuilder<undefined, "qb">;
      <TSelection extends SelectedFields>(fields: TSelection): GelSelectBuilder<TSelection, "qb">;
    };
    selectDistinct: {
      (): GelSelectBuilder<undefined, "qb">;
      <TSelection extends SelectedFields>(fields: TSelection): GelSelectBuilder<TSelection, "qb">;
    };
    selectDistinctOn: {
      (on: (GelColumn | SQLWrapper)[]): GelSelectBuilder<undefined, "qb">;
      <TSelection extends SelectedFields>(on: (GelColumn | SQLWrapper)[], fields: TSelection): GelSelectBuilder<TSelection, "qb">;
    };
  };
  select(): GelSelectBuilder<undefined, 'qb'>;
  select<TSelection extends SelectedFields>(fields: TSelection): GelSelectBuilder<TSelection, 'qb'>;
  selectDistinct(): GelSelectBuilder<undefined>;
  selectDistinct<TSelection extends SelectedFields>(fields: TSelection): GelSelectBuilder<TSelection>;
  selectDistinctOn(on: (GelColumn | SQLWrapper)[]): GelSelectBuilder<undefined>;
  selectDistinctOn<TSelection extends SelectedFields>(on: (GelColumn | SQLWrapper)[], fields: TSelection): GelSelectBuilder<TSelection>;
  private getDialect;
}
//#endregion
export { QueryBuilder };
//# sourceMappingURL=query-builder.d.ts.map