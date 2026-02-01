import { MsSqlColumn } from "./columns/common.js";
import { Check } from "./checks.js";
import { ForeignKey } from "./foreign-keys.js";
import { Index } from "./indexes.js";
import { PrimaryKey } from "./primary-keys.js";
import { UniqueConstraint } from "./unique-constraint.js";
import { MsSqlTable } from "./table.js";
import { MsSqlView } from "./view.js";
import "./index.js";
import { ColumnsSelection, SQL } from "../sql/sql.js";
import "../index.js";

//#region src/mssql-core/utils.d.ts
declare function getTableConfig(table: MsSqlTable): {
  columns: MsSqlColumn<any, object>[];
  indexes: Index[];
  foreignKeys: ForeignKey[];
  checks: Check[];
  primaryKeys: PrimaryKey[];
  uniqueConstraints: UniqueConstraint[];
  name: string;
  schema: string | undefined;
  baseName: string;
};
declare function getViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: MsSqlView<TName, TExisting>): {
  encryption?: boolean;
  schemaBinding?: boolean;
  viewMetadata?: boolean;
  checkOption?: boolean;
  name: TName;
  originalName: TName;
  schema: string | undefined;
  selectedFields: ColumnsSelection;
  isExisting: TExisting;
  query: TExisting extends true ? undefined : SQL<unknown>;
  isAlias: boolean;
};
//#endregion
export { getTableConfig, getViewConfig };
//# sourceMappingURL=utils.d.ts.map