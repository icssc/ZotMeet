import { SingleStoreColumn } from "./columns/common.js";
import { Index } from "./indexes.js";
import { PrimaryKey } from "./primary-keys.js";
import { UniqueConstraint } from "./unique-constraint.js";
import { SingleStoreTable } from "./table.js";
import "./index.js";
import { Subquery } from "../subquery.js";
import { SQL } from "../sql/sql.js";

//#region src/singlestore-core/utils.d.ts
declare function extractUsedTable(table: SingleStoreTable | Subquery | SQL): string[];
declare function getTableConfig(table: SingleStoreTable): {
  columns: SingleStoreColumn<any, {}>[];
  indexes: Index[];
  primaryKeys: PrimaryKey[];
  uniqueConstraints: UniqueConstraint[];
  name: string;
  schema: string | undefined;
  baseName: string;
};
//#endregion
export { extractUsedTable, getTableConfig };
//# sourceMappingURL=utils.d.ts.map