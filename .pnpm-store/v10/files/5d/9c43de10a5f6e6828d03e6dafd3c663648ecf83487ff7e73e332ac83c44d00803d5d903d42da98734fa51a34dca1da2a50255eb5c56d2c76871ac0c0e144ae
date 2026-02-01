import { CheckBuilder } from "./checks.cjs";
import { SQLiteColumns } from "./columns/common.cjs";
import { SQLiteColumnBuilders } from "./columns/all.cjs";
import { ForeignKeyBuilder } from "./foreign-keys.cjs";
import { IndexBuilder } from "./indexes.cjs";
import { PrimaryKeyBuilder } from "./primary-keys.cjs";
import { UniqueConstraintBuilder } from "./unique-constraint.cjs";
import { entityKind } from "../entity.cjs";
import { InferTableColumnsModels, Table, TableConfig as TableConfig$1, UpdateTableConfig } from "../table.cjs";
import { BuildColumns, ColumnBuilderBase } from "../column-builder.cjs";

//#region src/sqlite-core/table.d.ts
type SQLiteTableExtraConfigValue = IndexBuilder | CheckBuilder | ForeignKeyBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder;
type SQLiteTableExtraConfig = Record<string, SQLiteTableExtraConfigValue>;
type TableConfig = TableConfig$1<SQLiteColumns>;
declare class SQLiteTable<T extends TableConfig = TableConfig> extends Table<T> {
  static readonly [entityKind]: string;
}
type AnySQLiteTable<TPartial extends Partial<TableConfig> = {}> = SQLiteTable<UpdateTableConfig<TableConfig, TPartial>>;
type SQLiteTableWithColumns<T extends TableConfig> = SQLiteTable<T> & T['columns'] & InferTableColumnsModels<T['columns']>;
interface SQLiteTableFn<TSchema extends string | undefined = undefined> {
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'sqlite'>) => SQLiteTableExtraConfigValue[]): SQLiteTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'sqlite'>;
    dialect: 'sqlite';
  }>;
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: (columnTypes: SQLiteColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'sqlite'>) => SQLiteTableExtraConfigValue[]): SQLiteTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'sqlite'>;
    dialect: 'sqlite';
  }>;
  /**
   * @deprecated The third parameter of sqliteTable is changing and will only accept an array instead of an object
   *
   * @example
   * Deprecated version:
   * ```ts
   * export const users = sqliteTable("users", {
   * 	id: int(),
   * }, (t) => ({
   * 	idx: index('custom_name').on(t.id)
   * }));
   * ```
   *
   * New API:
   * ```ts
   * export const users = sqliteTable("users", {
   * 	id: int(),
   * }, (t) => [
   * 	index('custom_name').on(t.id)
   * ]);
   * ```
   */
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'sqlite'>) => SQLiteTableExtraConfig): SQLiteTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'sqlite'>;
    dialect: 'sqlite';
  }>;
  /**
   * @deprecated The third parameter of sqliteTable is changing and will only accept an array instead of an object
   *
   * @example
   * Deprecated version:
   * ```ts
   * export const users = sqliteTable("users", {
   * 	id: int(),
   * }, (t) => ({
   * 	idx: index('custom_name').on(t.id)
   * }));
   * ```
   *
   * New API:
   * ```ts
   * export const users = sqliteTable("users", {
   * 	id: int(),
   * }, (t) => [
   * 	index('custom_name').on(t.id)
   * ]);
   * ```
   */
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: (columnTypes: SQLiteColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'sqlite'>) => SQLiteTableExtraConfig): SQLiteTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'sqlite'>;
    dialect: 'sqlite';
  }>;
}
declare const sqliteTable: SQLiteTableFn;
declare function sqliteTableCreator(customizeTableName: (name: string) => string): SQLiteTableFn;
//#endregion
export { AnySQLiteTable, SQLiteTable, SQLiteTableExtraConfig, SQLiteTableExtraConfigValue, SQLiteTableFn, SQLiteTableWithColumns, TableConfig, sqliteTable, sqliteTableCreator };
//# sourceMappingURL=table.d.cts.map