import { MySqlColumns } from "./columns/common.cjs";
import { CheckBuilder } from "./checks.cjs";
import { MySqlColumnBuilders } from "./columns/all.cjs";
import { ForeignKeyBuilder } from "./foreign-keys.cjs";
import { PrimaryKeyBuilder } from "./primary-keys.cjs";
import { UniqueConstraintBuilder } from "./unique-constraint.cjs";
import { AnyIndexBuilder } from "./indexes.cjs";
import { entityKind } from "../entity.cjs";
import { InferTableColumnsModels, Table, TableConfig as TableConfig$1, UpdateTableConfig } from "../table.cjs";
import { BuildColumns, ColumnBuilderBase } from "../column-builder.cjs";

//#region src/mysql-core/table.d.ts
type MySqlTableExtraConfigValue = AnyIndexBuilder | CheckBuilder | ForeignKeyBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder;
type MySqlTableExtraConfig = Record<string, MySqlTableExtraConfigValue>;
type TableConfig = TableConfig$1<MySqlColumns>;
declare class MySqlTable<T extends TableConfig = TableConfig> extends Table<T> {
  static readonly [entityKind]: string;
}
type AnyMySqlTable<TPartial extends Partial<TableConfig> = {}> = MySqlTable<UpdateTableConfig<TableConfig, TPartial>>;
type MySqlTableWithColumns<T extends TableConfig> = MySqlTable<T> & T['columns'] & InferTableColumnsModels<T['columns']>;
declare function mysqlTableWithSchema<TTableName extends string, TSchemaName extends string | undefined, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap | ((columnTypes: MySqlColumnBuilders) => TColumnsMap), extraConfig: ((self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfig | MySqlTableExtraConfigValue[]) | undefined, schema: TSchemaName, baseName?: TTableName): MySqlTableWithColumns<{
  name: TTableName;
  schema: TSchemaName;
  columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
  dialect: 'mysql';
}>;
interface MySqlTableFn<TSchemaName extends string | undefined = undefined> {
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfigValue[]): MySqlTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
    dialect: 'mysql';
  }>;
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: (columnTypes: MySqlColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfigValue[]): MySqlTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
    dialect: 'mysql';
  }>;
  /**
   * @deprecated The third parameter of mysqlTable is changing and will only accept an array instead of an object
   *
   * @example
   * Deprecated version:
   * ```ts
   * export const users = mysqlTable("users", {
   * 	id: int(),
   * }, (t) => ({
   * 	idx: index('custom_name').on(t.id)
   * }));
   * ```
   *
   * New API:
   * ```ts
   * export const users = mysqlTable("users", {
   * 	id: int(),
   * }, (t) => [
   * 	index('custom_name').on(t.id)
   * ]);
   * ```
   */
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig: (self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfig): MySqlTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
    dialect: 'mysql';
  }>;
  /**
   * @deprecated The third parameter of mysqlTable is changing and will only accept an array instead of an object
   *
   * @example
   * Deprecated version:
   * ```ts
   * export const users = mysqlTable("users", {
   * 	id: int(),
   * }, (t) => ({
   * 	idx: index('custom_name').on(t.id)
   * }));
   * ```
   *
   * New API:
   * ```ts
   * export const users = mysqlTable("users", {
   * 	id: int(),
   * }, (t) => [
   * 	index('custom_name').on(t.id)
   * ]);
   * ```
   */
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: (columnTypes: MySqlColumnBuilders) => TColumnsMap, extraConfig: (self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfig): MySqlTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
    dialect: 'mysql';
  }>;
}
declare const mysqlTable: MySqlTableFn;
declare function mysqlTableCreator(customizeTableName: (name: string) => string): MySqlTableFn;
//#endregion
export { AnyMySqlTable, MySqlTable, MySqlTableExtraConfig, MySqlTableExtraConfigValue, MySqlTableFn, MySqlTableWithColumns, TableConfig, mysqlTable, mysqlTableCreator, mysqlTableWithSchema };
//# sourceMappingURL=table.d.cts.map