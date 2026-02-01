import { Placeholder, SQL, SQLWrapper } from "../sql/sql.js";
import { PgColumn } from "./columns/index.js";
export * from "../sql/expressions/index.js";

//#region src/pg-core/expressions.d.ts
declare function concat(column: PgColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
declare function substring(column: PgColumn | SQL.Aliased, {
  from,
  for: _for
}: {
  from?: number | Placeholder | SQLWrapper;
  for?: number | Placeholder | SQLWrapper;
}): SQL;
//#endregion
export { concat, substring };
//# sourceMappingURL=expressions.d.ts.map