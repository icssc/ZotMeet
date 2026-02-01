import { AddAliasToSelection } from "../query-builders/select.types.cjs";
import { ColumnsSelection } from "../sql/sql.cjs";
import { Subquery, WithSubquery } from "../subquery.cjs";

//#region src/gel-core/subquery.d.ts
type SubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = Subquery<TAlias, AddAliasToSelection<TSelection, TAlias, 'gel'>> & AddAliasToSelection<TSelection, TAlias, 'gel'>;
type WithSubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = WithSubquery<TAlias, AddAliasToSelection<TSelection, TAlias, 'gel'>> & AddAliasToSelection<TSelection, TAlias, 'gel'>;
//#endregion
export { SubqueryWithSelection, WithSubqueryWithSelection };
//# sourceMappingURL=subquery.d.cts.map