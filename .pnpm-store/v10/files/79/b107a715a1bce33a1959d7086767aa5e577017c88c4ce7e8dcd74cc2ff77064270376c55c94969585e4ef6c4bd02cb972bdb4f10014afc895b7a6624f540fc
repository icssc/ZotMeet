import { AnySingleStoreColumn, SingleStoreColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { SingleStoreTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/singlestore-core/primary-keys.d.ts
declare function primaryKey<TTableName extends string, TColumn extends AnySingleStoreColumn<{
  tableName: TTableName;
}>, TColumns extends AnySingleStoreColumn<{
  tableName: TTableName;
}>[]>(config: {
  name?: string;
  columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
declare function primaryKey<TTableName extends string, TColumns extends AnySingleStoreColumn<{
  tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
declare class PrimaryKeyBuilder {
  static readonly [entityKind]: string;
  constructor(columns: SingleStoreColumn[], name?: string);
}
declare class PrimaryKey {
  readonly table: SingleStoreTable;
  static readonly [entityKind]: string;
  readonly columns: SingleStoreColumn[];
  readonly name?: string;
  readonly isNameExplicit: boolean;
  constructor(table: SingleStoreTable, columns: SingleStoreColumn[], name?: string);
  getName(): string;
}
//#endregion
export { PrimaryKey, PrimaryKeyBuilder, primaryKey };
//# sourceMappingURL=primary-keys.d.cts.map