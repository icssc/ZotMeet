import { SQL, SQLWrapper } from "../sql/sql.js";
import { SQLiteColumn } from "./columns/index.js";
export * from "../sql/expressions/index.js";

//#region src/sqlite-core/expressions.d.ts
declare function concat(column: SQLiteColumn | SQL.Aliased, value: string | SQLWrapper): SQL;
declare function substring(column: SQLiteColumn | SQL.Aliased, {
  from,
  for: _for
}: {
  from?: number | SQLWrapper;
  for?: number | SQLWrapper;
}): SQL;
declare function rowId(): SQL<number>;
//#endregion
export { concat, rowId, substring };
//# sourceMappingURL=expressions.d.ts.map