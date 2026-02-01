import { SingleStoreColumn } from "./columns/common.cjs";
import { Index } from "./indexes.cjs";
import { PrimaryKey } from "./primary-keys.cjs";
import { UniqueConstraint } from "./unique-constraint.cjs";
import { SingleStoreTable } from "./table.cjs";
import "./index.cjs";
import { SQL } from "../sql/sql.cjs";
import { Subquery } from "../subquery.cjs";

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
//# sourceMappingURL=utils.d.cts.map