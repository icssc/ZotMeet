import { AnyMsSqlColumn, MsSqlColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { MsSqlTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/mssql-core/foreign-keys.d.ts
type UpdateDeleteAction = 'cascade' | 'no action' | 'set null' | 'set default';
type Reference = () => {
  readonly name?: string;
  readonly columns: MsSqlColumn[];
  readonly foreignTable: MsSqlTable;
  readonly foreignColumns: MsSqlColumn[];
};
declare class ForeignKeyBuilder {
  static readonly [entityKind]: string;
  constructor(config: () => {
    name?: string;
    columns: MsSqlColumn[];
    foreignColumns: MsSqlColumn[];
  }, actions?: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  } | undefined);
  onUpdate(action: UpdateDeleteAction): this;
  onDelete(action: UpdateDeleteAction): this;
}
type AnyForeignKeyBuilder = ForeignKeyBuilder;
declare class ForeignKey {
  readonly table: MsSqlTable;
  static readonly [entityKind]: string;
  readonly reference: Reference;
  readonly onUpdate: UpdateDeleteAction | undefined;
  readonly onDelete: UpdateDeleteAction | undefined;
  constructor(table: MsSqlTable, builder: ForeignKeyBuilder);
  getName(): string | undefined;
  isNameExplicit(): boolean;
}
type ColumnsWithTable<TTableName extends string, TColumns extends MsSqlColumn[]> = { [Key in keyof TColumns]: AnyMsSqlColumn<{
  tableName: TTableName;
}> };
type GetColumnsTable<TColumns extends MsSqlColumn | MsSqlColumn[]> = (TColumns extends MsSqlColumn ? TColumns : TColumns extends MsSqlColumn[] ? TColumns[number] : never) extends AnyMsSqlColumn<{
  tableName: infer TTableName extends string;
}> ? TTableName : never;
declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnyMsSqlColumn<{
  tableName: TTableName;
}>, ...AnyMsSqlColumn<{
  tableName: TTableName;
}>[]]>(config: {
  name?: string;
  columns: TColumns;
  foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
//#endregion
export { AnyForeignKeyBuilder, ForeignKey, ForeignKeyBuilder, GetColumnsTable, Reference, UpdateDeleteAction, foreignKey };
//# sourceMappingURL=foreign-keys.d.cts.map