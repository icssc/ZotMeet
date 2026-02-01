import { Placeholder, SQL, SQLWrapper } from "../sql/sql.cjs";
import { GelColumn } from "./columns/index.cjs";
export * from "../sql/expressions/index.cjs";

//#region src/gel-core/expressions.d.ts
declare function concat(column: GelColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
declare function substring(column: GelColumn | SQL.Aliased, {
  from,
  for: _for
}: {
  from?: number | Placeholder | SQLWrapper;
  for?: number | Placeholder | SQLWrapper;
}): SQL;
//#endregion
export { concat, substring };
//# sourceMappingURL=expressions.d.cts.map