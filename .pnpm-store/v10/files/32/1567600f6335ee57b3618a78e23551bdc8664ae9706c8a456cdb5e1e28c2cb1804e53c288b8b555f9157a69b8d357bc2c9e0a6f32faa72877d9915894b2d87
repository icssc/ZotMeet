import { Subquery, WithSubquery } from "../subquery.js";
import { ColumnsSelection } from "../sql/sql.js";
import { AddAliasToSelection } from "../query-builders/select.types.js";

//#region src/gel-core/subquery.d.ts
type SubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = Subquery<TAlias, AddAliasToSelection<TSelection, TAlias, 'gel'>> & AddAliasToSelection<TSelection, TAlias, 'gel'>;
type WithSubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = WithSubquery<TAlias, AddAliasToSelection<TSelection, TAlias, 'gel'>> & AddAliasToSelection<TSelection, TAlias, 'gel'>;
//#endregion
export { SubqueryWithSelection, WithSubqueryWithSelection };
//# sourceMappingURL=subquery.d.ts.map