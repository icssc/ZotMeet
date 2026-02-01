import { AnyMsSqlColumn, MsSqlColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { MsSqlTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/mssql-core/primary-keys.d.ts
declare function primaryKey<TTableName extends string, TColumn extends AnyMsSqlColumn<{
  tableName: TTableName;
}>, TColumns extends AnyMsSqlColumn<{
  tableName: TTableName;
}>[]>(config: {
  name?: string;
  columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
declare class PrimaryKeyBuilder {
  static readonly [entityKind]: string;
  constructor(columns: MsSqlColumn[], name?: string);
}
declare class PrimaryKey {
  readonly table: MsSqlTable;
  static readonly [entityKind]: string;
  readonly columns: MsSqlColumn[];
  readonly name?: string;
  readonly isNameExplicit: boolean;
  constructor(table: MsSqlTable, columns: MsSqlColumn[], name?: string);
  getName(): string | undefined;
}
//#endregion
export { PrimaryKey, PrimaryKeyBuilder, primaryKey };
//# sourceMappingURL=primary-keys.d.cts.map