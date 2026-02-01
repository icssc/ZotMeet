import { GelTable } from "./table.cjs";
import { AnyGelColumn, GelColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { entityKind } from "../entity.cjs";

//#region src/gel-core/foreign-keys.d.ts
type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
type Reference = () => {
  readonly name?: string;
  readonly columns: GelColumn[];
  readonly foreignTable: GelTable;
  readonly foreignColumns: GelColumn[];
};
declare class ForeignKeyBuilder {
  static readonly [entityKind]: string;
  constructor(config: () => {
    name?: string;
    columns: GelColumn[];
    foreignColumns: GelColumn[];
  }, actions?: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  } | undefined);
  onUpdate(action: UpdateDeleteAction): this;
  onDelete(action: UpdateDeleteAction): this;
}
type AnyForeignKeyBuilder = ForeignKeyBuilder;
declare class ForeignKey {
  readonly table: GelTable;
  static readonly [entityKind]: string;
  readonly reference: Reference;
  readonly onUpdate: UpdateDeleteAction | undefined;
  readonly onDelete: UpdateDeleteAction | undefined;
  constructor(table: GelTable, builder: ForeignKeyBuilder);
  getName(): string;
}
type ColumnsWithTable<TTableName extends string, TColumns extends GelColumn[]> = { [Key in keyof TColumns]: AnyGelColumn<{
  tableName: TTableName;
}> };
declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnyGelColumn<{
  tableName: TTableName;
}>, ...AnyGelColumn<{
  tableName: TTableName;
}>[]]>(config: {
  name?: string;
  columns: TColumns;
  foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
//#endregion
export { AnyForeignKeyBuilder, ForeignKey, ForeignKeyBuilder, Reference, UpdateDeleteAction, foreignKey };
//# sourceMappingURL=foreign-keys.d.cts.map