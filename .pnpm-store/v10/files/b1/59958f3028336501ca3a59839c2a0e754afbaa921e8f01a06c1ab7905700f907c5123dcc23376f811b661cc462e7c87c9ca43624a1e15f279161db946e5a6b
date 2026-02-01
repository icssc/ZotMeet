import { QueryBuilder } from "./query-builders/query-builder.js";
import { Subquery, WithSubquery, WithSubqueryWithoutSelection } from "../subquery.js";
import { ColumnsSelection, SQL } from "../sql/sql.js";
import { TypedQueryBuilder } from "../query-builders/query-builder.js";
import { AddAliasToSelection } from "../query-builders/select.types.js";

//#region src/singlestore-core/subquery.d.ts
type SubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = Subquery<TAlias, AddAliasToSelection<TSelection, TAlias, 'singlestore'>> & AddAliasToSelection<TSelection, TAlias, 'singlestore'>;
type WithSubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = WithSubquery<TAlias, AddAliasToSelection<TSelection, TAlias, 'singlestore'>> & AddAliasToSelection<TSelection, TAlias, 'singlestore'>;
interface WithBuilder {
  <TAlias extends string>(alias: TAlias): {
    as: {
      <TSelection extends ColumnsSelection>(qb: TypedQueryBuilder<TSelection> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelection>)): WithSubqueryWithSelection<TSelection, TAlias>;
      (qb: TypedQueryBuilder<undefined> | ((qb: QueryBuilder) => TypedQueryBuilder<undefined>)): WithSubqueryWithoutSelection<TAlias>;
    };
  };
  <TAlias extends string, TSelection extends ColumnsSelection>(alias: TAlias, selection: TSelection): {
    as: (qb: SQL | ((qb: QueryBuilder) => SQL)) => WithSubqueryWithSelection<TSelection, TAlias>;
  };
}
//#endregion
export { SubqueryWithSelection, WithBuilder, WithSubqueryWithSelection };
//# sourceMappingURL=subquery.d.ts.map