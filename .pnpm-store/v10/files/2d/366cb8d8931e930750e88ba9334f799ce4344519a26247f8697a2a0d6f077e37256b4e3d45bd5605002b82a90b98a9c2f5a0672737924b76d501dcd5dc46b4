import { AnyMySqlColumn, MySqlColumn } from "./columns/common.js";
import "./columns/index.js";
import { MySqlTable } from "./table.js";
import { entityKind } from "../entity.js";

//#region src/mysql-core/foreign-keys.d.ts
type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
type Reference = () => {
  readonly name?: string;
  readonly columns: MySqlColumn[];
  readonly foreignTable: MySqlTable;
  readonly foreignColumns: MySqlColumn[];
};
declare class ForeignKeyBuilder {
  static readonly [entityKind]: string;
  constructor(config: () => {
    name?: string;
    columns: MySqlColumn[];
    foreignColumns: MySqlColumn[];
  }, actions?: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  } | undefined);
  onUpdate(action: UpdateDeleteAction): this;
  onDelete(action: UpdateDeleteAction): this;
}
type AnyForeignKeyBuilder = ForeignKeyBuilder;
declare class ForeignKey {
  readonly table: MySqlTable;
  static readonly [entityKind]: string;
  readonly reference: Reference;
  readonly onUpdate: UpdateDeleteAction | undefined;
  readonly onDelete: UpdateDeleteAction | undefined;
  constructor(table: MySqlTable, builder: ForeignKeyBuilder);
  getName(): string;
  isNameExplicit(): boolean;
}
type ColumnsWithTable<TTableName extends string, TColumns extends MySqlColumn[]> = { [Key in keyof TColumns]: AnyMySqlColumn<{
  tableName: TTableName;
}> };
type GetColumnsTable<TColumns extends MySqlColumn | MySqlColumn[]> = (TColumns extends MySqlColumn ? TColumns : TColumns extends MySqlColumn[] ? TColumns[number] : never) extends AnyMySqlColumn<{
  tableName: infer TTableName extends string;
}> ? TTableName : never;
declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnyMySqlColumn<{
  tableName: TTableName;
}>, ...AnyMySqlColumn<{
  tableName: TTableName;
}>[]]>(config: {
  name?: string;
  columns: TColumns;
  foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
//#endregion
export { AnyForeignKeyBuilder, ForeignKey, ForeignKeyBuilder, GetColumnsTable, Reference, UpdateDeleteAction, foreignKey };
//# sourceMappingURL=foreign-keys.d.ts.map