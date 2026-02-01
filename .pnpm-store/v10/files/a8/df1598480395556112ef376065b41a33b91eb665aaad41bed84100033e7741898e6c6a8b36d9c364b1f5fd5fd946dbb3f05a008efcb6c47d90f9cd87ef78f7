import { MsSqlSelectBuilder } from "./select.cjs";
import { SelectedFields } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { ColumnsSelection } from "../../sql/sql.cjs";
import { WithSubquery } from "../../subquery.cjs";
import { MsSqlDialect, MsSqlDialectConfig } from "../dialect.cjs";
import { WithSubqueryWithSelection } from "../subquery.cjs";

//#region src/mssql-core/query-builders/query-builder.d.ts
declare class QueryBuilder {
  static readonly [entityKind]: string;
  private dialect;
  private dialectConfig;
  constructor(dialect?: MsSqlDialect | MsSqlDialectConfig);
  $with<TAlias extends string>(alias: TAlias): {
    as<TSelection extends ColumnsSelection>(qb: TypedQueryBuilder<TSelection> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelection>)): WithSubqueryWithSelection<TSelection, TAlias>;
  };
  with(...queries: WithSubquery[]): {
    select: {
      (): MsSqlSelectBuilder<undefined, never, "qb">;
      <TSelection extends SelectedFields>(fields: TSelection): MsSqlSelectBuilder<TSelection, never, "qb">;
    };
    selectDistinct: {
      (): MsSqlSelectBuilder<undefined, never, "qb">;
      <TSelection extends SelectedFields>(fields: TSelection): MsSqlSelectBuilder<TSelection, never, "qb">;
    };
  };
  select(): MsSqlSelectBuilder<undefined, never, 'qb'>;
  select<TSelection extends SelectedFields>(fields: TSelection): MsSqlSelectBuilder<TSelection, never, 'qb'>;
  selectDistinct(): MsSqlSelectBuilder<undefined, never, 'qb'>;
  selectDistinct<TSelection extends SelectedFields>(fields: TSelection): MsSqlSelectBuilder<TSelection, never, 'qb'>;
  private getDialect;
}
//#endregion
export { QueryBuilder };
//# sourceMappingURL=query-builder.d.cts.map