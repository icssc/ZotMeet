import { SingleStoreColumn } from "./columns/common.js";
import "./columns/index.js";
import { Placeholder, SQL, SQLWrapper } from "../sql/sql.js";
export * from "../sql/expressions/index.js";

//#region src/singlestore-core/expressions.d.ts
declare function concat(column: SingleStoreColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
declare function substring(column: SingleStoreColumn | SQL.Aliased, {
  from,
  for: _for
}: {
  from?: number | Placeholder | SQLWrapper;
  for?: number | Placeholder | SQLWrapper;
}): SQL;
declare function dotProduct(column: SingleStoreColumn | SQL.Aliased, value: Array<number>): SQL;
declare function euclideanDistance(column: SingleStoreColumn | SQL.Aliased, value: Array<number>): SQL;
//#endregion
export { concat, dotProduct, euclideanDistance, substring };
//# sourceMappingURL=expressions.d.ts.map