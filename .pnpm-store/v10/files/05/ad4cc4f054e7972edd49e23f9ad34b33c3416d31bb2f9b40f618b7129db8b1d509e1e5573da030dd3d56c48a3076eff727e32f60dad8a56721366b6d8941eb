import { AnyCockroachColumn, CockroachColumn } from "./columns/common.js";
import "./columns/index.js";
import { Check } from "./checks.js";
import { ForeignKey } from "./foreign-keys.js";
import { Index } from "./indexes.js";
import { CockroachPolicy } from "./policies.js";
import { PrimaryKey } from "./primary-keys.js";
import { UniqueConstraint } from "./unique-constraint.js";
import { CockroachMaterializedView, CockroachView } from "./view.js";
import "./index.js";
import { ColumnsSelection, SQL } from "../sql/sql.js";
import "../index.js";
import { CockroachTable } from "./table.js";

//#region src/cockroach-core/utils.d.ts
declare function getTableConfig<TTable extends CockroachTable>(table: TTable): {
  columns: CockroachColumn<any, {}>[];
  indexes: Index[];
  foreignKeys: ForeignKey[];
  checks: Check[];
  primaryKeys: PrimaryKey[];
  uniqueConstraints: UniqueConstraint[];
  name: string;
  schema: string | undefined;
  policies: CockroachPolicy[];
  enableRLS: boolean;
};
declare function getViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: CockroachView<TName, TExisting>): {
  name: TName;
  originalName: TName;
  schema: string | undefined;
  selectedFields: ColumnsSelection;
  isExisting: TExisting;
  query: TExisting extends true ? undefined : SQL<unknown>;
  isAlias: boolean;
};
declare function getMaterializedViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: CockroachMaterializedView<TName, TExisting>): {
  withNoData?: boolean;
  name: TName;
  originalName: TName;
  schema: string | undefined;
  selectedFields: ColumnsSelection;
  isExisting: TExisting;
  query: TExisting extends true ? undefined : SQL<unknown>;
  isAlias: boolean;
};
type ColumnsWithTable<TTableName extends string, TForeignTableName extends string, TColumns extends AnyCockroachColumn<{
  tableName: TTableName;
}>[]> = { [Key in keyof TColumns]: AnyCockroachColumn<{
  tableName: TForeignTableName;
}> };
//#endregion
export { ColumnsWithTable, getMaterializedViewConfig, getTableConfig, getViewConfig };
//# sourceMappingURL=utils.d.ts.map