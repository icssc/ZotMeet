import { MsSqlColumn } from "./columns/common.js";
import "./columns/index.js";
import { Placeholder, SQL, SQLWrapper } from "../sql/sql.js";
export * from "../sql/expressions/index.js";

//#region src/mssql-core/expressions.d.ts
declare function concat(column: MsSqlColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
declare function substring(column: MsSqlColumn | SQL.Aliased, {
  from,
  for: _for
}: {
  from?: number | Placeholder | SQLWrapper;
  for?: number | Placeholder | SQLWrapper;
}): SQL;
//#endregion
export { concat, substring };
//# sourceMappingURL=expressions.d.ts.map