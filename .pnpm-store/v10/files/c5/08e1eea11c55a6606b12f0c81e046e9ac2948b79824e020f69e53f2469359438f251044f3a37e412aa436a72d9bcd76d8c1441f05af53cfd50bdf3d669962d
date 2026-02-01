import { AnyCockroachColumn, CockroachColumn } from "./columns/common.js";
import "./columns/index.js";
import { CockroachTable } from "./table.js";
import { entityKind } from "../entity.js";

//#region src/cockroach-core/foreign-keys.d.ts
type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
type Reference = () => {
  readonly name?: string;
  readonly columns: CockroachColumn[];
  readonly foreignTable: CockroachTable;
  readonly foreignColumns: CockroachColumn[];
};
declare class ForeignKeyBuilder {
  static readonly [entityKind]: string;
  constructor(config: () => {
    name?: string;
    columns: CockroachColumn[];
    foreignColumns: CockroachColumn[];
  }, actions?: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  } | undefined);
  onUpdate(action: UpdateDeleteAction): this;
  onDelete(action: UpdateDeleteAction): this;
}
type AnyForeignKeyBuilder = ForeignKeyBuilder;
declare class ForeignKey {
  readonly table: CockroachTable;
  static readonly [entityKind]: string;
  readonly reference: Reference;
  readonly onUpdate: UpdateDeleteAction | undefined;
  readonly onDelete: UpdateDeleteAction | undefined;
  readonly name?: string;
  constructor(table: CockroachTable, builder: ForeignKeyBuilder);
  getName(): string | undefined;
  isNameExplicit(): boolean;
}
type ColumnsWithTable<TTableName extends string, TColumns extends CockroachColumn[]> = { [Key in keyof TColumns]: AnyCockroachColumn<{
  tableName: TTableName;
}> };
declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnyCockroachColumn<{
  tableName: TTableName;
}>, ...AnyCockroachColumn<{
  tableName: TTableName;
}>[]]>(config: {
  name?: string;
  columns: TColumns;
  foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
//#endregion
export { AnyForeignKeyBuilder, ForeignKey, ForeignKeyBuilder, Reference, UpdateDeleteAction, foreignKey };
//# sourceMappingURL=foreign-keys.d.ts.map