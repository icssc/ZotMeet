import { MsSqlColumn } from "./columns/common.cjs";
import { Check } from "./checks.cjs";
import { ForeignKey } from "./foreign-keys.cjs";
import { Index } from "./indexes.cjs";
import { PrimaryKey } from "./primary-keys.cjs";
import { UniqueConstraint } from "./unique-constraint.cjs";
import { MsSqlTable } from "./table.cjs";
import { MsSqlView } from "./view.cjs";
import "./index.cjs";
import { ColumnsSelection, SQL } from "../sql/sql.cjs";
import "../index.cjs";

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
//# sourceMappingURL=utils.d.cts.map