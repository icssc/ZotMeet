import { AnySQLiteColumn, SQLiteColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { SQLiteTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/sqlite-core/primary-keys.d.ts
declare function primaryKey<TTableName extends string, TColumn extends AnySQLiteColumn<{
  tableName: TTableName;
}>, TColumns extends AnySQLiteColumn<{
  tableName: TTableName;
}>[]>(config: {
  name?: string;
  columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
declare function primaryKey<TTableName extends string, TColumns extends AnySQLiteColumn<{
  tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
declare class PrimaryKeyBuilder {
  static readonly [entityKind]: string;
  _: {
    brand: 'SQLitePrimaryKeyBuilder';
  };
  constructor(columns: SQLiteColumn[], name?: string);
}
declare class PrimaryKey {
  readonly table: SQLiteTable;
  static readonly [entityKind]: string;
  readonly columns: SQLiteColumn[];
  readonly name?: string;
  readonly isNameExplicit: boolean;
  constructor(table: SQLiteTable, columns: SQLiteColumn[], name?: string);
  getName(): string;
}
//#endregion
export { PrimaryKey, PrimaryKeyBuilder, primaryKey };
//# sourceMappingURL=primary-keys.d.cts.map