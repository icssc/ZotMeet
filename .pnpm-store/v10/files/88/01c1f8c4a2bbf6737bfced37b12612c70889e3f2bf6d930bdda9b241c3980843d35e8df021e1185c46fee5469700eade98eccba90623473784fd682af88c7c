import { GelTable } from "./table.cjs";
import { AnyGelColumn, GelColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { entityKind } from "../entity.cjs";

//#region src/gel-core/primary-keys.d.ts
declare function primaryKey<TTableName extends string, TColumn extends AnyGelColumn<{
  tableName: TTableName;
}>, TColumns extends AnyGelColumn<{
  tableName: TTableName;
}>[]>(config: {
  name?: string;
  columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
declare function primaryKey<TTableName extends string, TColumns extends AnyGelColumn<{
  tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
declare class PrimaryKeyBuilder {
  static readonly [entityKind]: string;
  constructor(columns: GelColumn[], name?: string);
}
declare class PrimaryKey {
  readonly table: GelTable;
  static readonly [entityKind]: string;
  readonly columns: AnyGelColumn<{}>[];
  readonly name?: string;
  constructor(table: GelTable, columns: AnyGelColumn<{}>[], name?: string);
  getName(): string;
}
//#endregion
export { PrimaryKey, PrimaryKeyBuilder, primaryKey };
//# sourceMappingURL=primary-keys.d.cts.map