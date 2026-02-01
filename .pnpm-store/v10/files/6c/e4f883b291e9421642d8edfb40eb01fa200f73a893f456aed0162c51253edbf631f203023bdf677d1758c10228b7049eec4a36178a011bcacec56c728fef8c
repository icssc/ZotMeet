import { Check } from "./checks.js";
import { Index } from "./indexes.js";
import { PgColumn, PgColumnBaseConfig } from "./columns/common.js";
import { ForeignKey } from "./foreign-keys.js";
import { PgPolicy } from "./policies.js";
import { PrimaryKey } from "./primary-keys.js";
import { UniqueConstraint } from "./unique-constraint.js";
import { PgViewBase } from "./view-base.js";
import { PgMaterializedView, PgMaterializedViewWithConfig, PgView, ViewWithConfig } from "./view.js";
import "./index.js";
import { Subquery } from "../subquery.js";
import * as __sql_sql_ts3 from "../sql/sql.js";
import { SQL } from "../sql/sql.js";
import { PgTable } from "./table.js";

//#region src/pg-core/utils.d.ts
declare function getTableConfig<TTable extends PgTable>(table: TTable): {
  columns: PgColumn<any, PgColumnBaseConfig<any>, {}>[];
  indexes: Index[];
  foreignKeys: ForeignKey[];
  checks: Check[];
  primaryKeys: PrimaryKey[];
  uniqueConstraints: UniqueConstraint[];
  name: string;
  schema: string | undefined;
  policies: PgPolicy[];
  enableRLS: boolean;
};
declare function extractUsedTable(table: PgTable | Subquery | PgViewBase | SQL): string[];
declare function getViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: PgView<TName, TExisting>): {
  with?: ViewWithConfig;
  name: TName;
  originalName: TName;
  schema: string | undefined;
  selectedFields: __sql_sql_ts3.ColumnsSelection;
  isExisting: TExisting;
  query: TExisting extends true ? undefined : SQL<unknown>;
  isAlias: boolean;
};
declare function getMaterializedViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: PgMaterializedView<TName, TExisting>): {
  with?: PgMaterializedViewWithConfig;
  using?: string;
  tablespace?: string;
  withNoData?: boolean;
  name: TName;
  originalName: TName;
  schema: string | undefined;
  selectedFields: __sql_sql_ts3.ColumnsSelection;
  isExisting: TExisting;
  query: TExisting extends true ? undefined : SQL<unknown>;
  isAlias: boolean;
};
//#endregion
export { extractUsedTable, getMaterializedViewConfig, getTableConfig, getViewConfig };
//# sourceMappingURL=utils.d.ts.map