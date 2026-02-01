import { MsSqlSelectBuilder } from "./select.js";
import { SelectedFields } from "./select.types.js";
import { entityKind } from "../../entity.js";
import { WithSubquery } from "../../subquery.js";
import { ColumnsSelection } from "../../sql/sql.js";
import { TypedQueryBuilder } from "../../query-builders/query-builder.js";
import { MsSqlDialect, MsSqlDialectConfig } from "../dialect.js";
import { WithSubqueryWithSelection } from "../subquery.js";

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
//# sourceMappingURL=query-builder.d.ts.map