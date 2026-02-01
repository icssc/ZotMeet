import { MySqlColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { Placeholder, SQL, SQLWrapper } from "../sql/sql.cjs";
export * from "../sql/expressions/index.cjs";

//#region src/mysql-core/expressions.d.ts
declare function concat(column: MySqlColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
declare function substring(column: MySqlColumn | SQL.Aliased, {
  from,
  for: _for
}: {
  from?: number | Placeholder | SQLWrapper;
  for?: number | Placeholder | SQLWrapper;
}): SQL;
//#endregion
export { concat, substring };
//# sourceMappingURL=expressions.d.cts.map