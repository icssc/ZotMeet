import { AnyCockroachColumn, CockroachColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { Check } from "./checks.cjs";
import { ForeignKey } from "./foreign-keys.cjs";
import { Index } from "./indexes.cjs";
import { CockroachPolicy } from "./policies.cjs";
import { PrimaryKey } from "./primary-keys.cjs";
import { UniqueConstraint } from "./unique-constraint.cjs";
import { CockroachMaterializedView, CockroachView } from "./view.cjs";
import "./index.cjs";
import { ColumnsSelection, SQL } from "../sql/sql.cjs";
import "../index.cjs";
import { CockroachTable } from "./table.cjs";

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
//# sourceMappingURL=utils.d.cts.map