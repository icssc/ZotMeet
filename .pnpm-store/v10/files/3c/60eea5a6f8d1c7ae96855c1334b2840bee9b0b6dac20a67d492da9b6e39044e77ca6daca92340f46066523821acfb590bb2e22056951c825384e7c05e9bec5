import { SQL, SQLWrapper } from "../sql/sql.cjs";
import { SQLiteColumn } from "./columns/index.cjs";
export * from "../sql/expressions/index.cjs";

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
//# sourceMappingURL=expressions.d.cts.map