import "./columns/index.js";
import { AnyPgColumn, PgColumn } from "./columns/common.js";
import { PgTable } from "./table.js";
import { entityKind } from "../entity.js";

//#region src/pg-core/foreign-keys.d.ts
type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
type Reference = () => {
  readonly name?: string;
  readonly columns: PgColumn[];
  readonly foreignTable: PgTable;
  readonly foreignColumns: PgColumn[];
};
declare class ForeignKeyBuilder {
  static readonly [entityKind]: string;
  constructor(config: () => {
    name?: string;
    columns: PgColumn[];
    foreignColumns: PgColumn[];
  }, actions?: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  } | undefined);
  onUpdate(action: UpdateDeleteAction): this;
  onDelete(action: UpdateDeleteAction): this;
}
type AnyForeignKeyBuilder = ForeignKeyBuilder;
declare class ForeignKey {
  readonly table: PgTable;
  static readonly [entityKind]: string;
  readonly reference: Reference;
  readonly onUpdate: UpdateDeleteAction | undefined;
  readonly onDelete: UpdateDeleteAction | undefined;
  readonly name?: string;
  constructor(table: PgTable, builder: ForeignKeyBuilder);
  getName(): string;
  isNameExplicit(): boolean;
}
type ColumnsWithTable<TTableName extends string, TColumns extends PgColumn[]> = { [Key in keyof TColumns]: AnyPgColumn<{
  tableName: TTableName;
}> };
declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnyPgColumn<{
  tableName: TTableName;
}>, ...AnyPgColumn<{
  tableName: TTableName;
}>[]]>(config: {
  name?: string;
  columns: TColumns;
  foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
//#endregion
export { AnyForeignKeyBuilder, ForeignKey, ForeignKeyBuilder, Reference, UpdateDeleteAction, foreignKey };
//# sourceMappingURL=foreign-keys.d.ts.map