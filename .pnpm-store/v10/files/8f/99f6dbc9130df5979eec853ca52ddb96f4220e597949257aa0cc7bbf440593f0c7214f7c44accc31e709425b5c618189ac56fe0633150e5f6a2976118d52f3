import { AnySQLiteColumn, SQLiteColumn } from "./columns/common.js";
import "./columns/index.js";
import { SQLiteTable } from "./table.js";
import { entityKind } from "../entity.js";

//#region src/sqlite-core/foreign-keys.d.ts
type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
type Reference = () => {
  readonly name?: string;
  readonly columns: SQLiteColumn[];
  readonly foreignTable: SQLiteTable;
  readonly foreignColumns: SQLiteColumn[];
};
declare class ForeignKeyBuilder {
  static readonly [entityKind]: string;
  _: {
    brand: 'SQLiteForeignKeyBuilder';
    foreignTableName: 'TForeignTableName';
  };
  constructor(config: () => {
    name?: string;
    columns: SQLiteColumn[];
    foreignColumns: SQLiteColumn[];
  }, actions?: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  } | undefined);
  onUpdate(action: UpdateDeleteAction): this;
  onDelete(action: UpdateDeleteAction): this;
}
declare class ForeignKey {
  readonly table: SQLiteTable;
  static readonly [entityKind]: string;
  readonly reference: Reference;
  readonly onUpdate: UpdateDeleteAction | undefined;
  readonly onDelete: UpdateDeleteAction | undefined;
  constructor(table: SQLiteTable, builder: ForeignKeyBuilder);
  getName(): string;
  isNameExplicit(): boolean;
}
type ColumnsWithTable<TTableName extends string, TColumns extends SQLiteColumn[]> = { [Key in keyof TColumns]: AnySQLiteColumn<{
  tableName: TTableName;
}> };
declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnySQLiteColumn<{
  tableName: TTableName;
}>, ...AnySQLiteColumn<{
  tableName: TTableName;
}>[]]>(config: {
  name?: string;
  columns: TColumns;
  foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
//#endregion
export { ForeignKey, ForeignKeyBuilder, Reference, UpdateDeleteAction, foreignKey };
//# sourceMappingURL=foreign-keys.d.ts.map