import { AnyMySqlColumn, MySqlColumn } from "./columns/common.js";
import "./columns/index.js";
import { MySqlTable } from "./table.js";
import { entityKind } from "../entity.js";

//#region src/mysql-core/primary-keys.d.ts
declare function primaryKey<TTableName extends string, TColumn extends AnyMySqlColumn<{
  tableName: TTableName;
}>, TColumns extends AnyMySqlColumn<{
  tableName: TTableName;
}>[]>(config: {
  columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
declare function primaryKey<TTableName extends string, TColumns extends AnyMySqlColumn<{
  tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
declare class PrimaryKeyBuilder {
  static readonly [entityKind]: string;
  constructor(columns: MySqlColumn[]);
}
declare class PrimaryKey {
  readonly table: MySqlTable;
  static readonly [entityKind]: string;
  readonly columns: MySqlColumn[];
  constructor(table: MySqlTable, columns: MySqlColumn[]);
}
//#endregion
export { PrimaryKey, PrimaryKeyBuilder, primaryKey };
//# sourceMappingURL=primary-keys.d.ts.map