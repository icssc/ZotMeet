import { SQLiteViewBase } from "./view-base.cjs";
import { SQLiteView } from "./view.cjs";
import { Check } from "./checks.cjs";
import { SQLiteColumn } from "./columns/common.cjs";
import { ForeignKey } from "./foreign-keys.cjs";
import { Index } from "./indexes.cjs";
import { PrimaryKey } from "./primary-keys.cjs";
import { UniqueConstraint } from "./unique-constraint.cjs";
import { SQLiteTable } from "./table.cjs";
import "./index.cjs";
import * as __sql_sql_ts1 from "../sql/sql.cjs";
import { SQL } from "../sql/sql.cjs";
import { Subquery } from "../subquery.cjs";

//#region src/sqlite-core/utils.d.ts
declare function getTableConfig<TTable extends SQLiteTable>(table: TTable): {
  columns: SQLiteColumn<any, {}>[];
  indexes: Index[];
  foreignKeys: ForeignKey[];
  checks: Check[];
  primaryKeys: PrimaryKey[];
  uniqueConstraints: UniqueConstraint[];
  name: string;
};
declare function extractUsedTable(table: SQLiteTable | Subquery | SQLiteViewBase | SQL): string[];
type OnConflict = 'rollback' | 'abort' | 'fail' | 'ignore' | 'replace';
declare function getViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: SQLiteView<TName, TExisting>): {
  name: TName;
  originalName: TName;
  schema: string | undefined;
  selectedFields: __sql_sql_ts1.ColumnsSelection;
  isExisting: TExisting;
  query: TExisting extends true ? undefined : SQL<unknown>;
  isAlias: boolean;
};
//#endregion
export { OnConflict, extractUsedTable, getTableConfig, getViewConfig };
//# sourceMappingURL=utils.d.cts.map