import { SingleStoreColumns } from "./columns/common.cjs";
import { SingleStoreColumnBuilders } from "./columns/all.cjs";
import { AnyIndexBuilder } from "./indexes.cjs";
import { PrimaryKeyBuilder } from "./primary-keys.cjs";
import { UniqueConstraintBuilder } from "./unique-constraint.cjs";
import { entityKind } from "../entity.cjs";
import { InferTableColumnsModels, Table, TableConfig as TableConfig$1, UpdateTableConfig } from "../table.cjs";
import { BuildColumns, ColumnBuilderBase } from "../column-builder.cjs";

//#region src/singlestore-core/table.d.ts
type SingleStoreTableExtraConfigValue = AnyIndexBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder;
type SingleStoreTableExtraConfig = Record<string, SingleStoreTableExtraConfigValue>;
type TableConfig = TableConfig$1<SingleStoreColumns>;
declare class SingleStoreTable<T extends TableConfig = TableConfig> extends Table<T> {
  static readonly [entityKind]: string;
}
type AnySingleStoreTable<TPartial extends Partial<TableConfig> = {}> = SingleStoreTable<UpdateTableConfig<TableConfig, TPartial>>;
type SingleStoreTableWithColumns<T extends TableConfig> = SingleStoreTable<T> & T['columns'] & InferTableColumnsModels<T['columns']>;
declare function singlestoreTableWithSchema<TTableName extends string, TSchemaName extends string | undefined, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap | ((columnTypes: SingleStoreColumnBuilders) => TColumnsMap), extraConfig: ((self: BuildColumns<TTableName, TColumnsMap, 'singlestore'>) => SingleStoreTableExtraConfig | SingleStoreTableExtraConfigValue[]) | undefined, schema: TSchemaName, baseName?: TTableName): SingleStoreTableWithColumns<{
  name: TTableName;
  schema: TSchemaName;
  columns: BuildColumns<TTableName, TColumnsMap, 'singlestore'>;
  dialect: 'singlestore';
}>;
interface SingleStoreTableFn<TSchemaName extends string | undefined = undefined> {
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'singlestore'>) => SingleStoreTableExtraConfigValue[]): SingleStoreTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'singlestore'>;
    dialect: 'singlestore';
  }>;
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: (columnTypes: SingleStoreColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'singlestore'>) => SingleStoreTableExtraConfigValue[]): SingleStoreTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'singlestore'>;
    dialect: 'singlestore';
  }>;
  /**
   * @deprecated The third parameter of singlestoreTable is changing and will only accept an array instead of an object
   *
   * @example
   * Deprecated version:
   * ```ts
   * export const users = singlestoreTable("users", {
   * 	id: int(),
   * }, (t) => ({
   * 	idx: index('custom_name').on(t.id)
   * }));
   * ```
   *
   * New API:
   * ```ts
   * export const users = singlestoreTable("users", {
   * 	id: int(),
   * }, (t) => [
   * 	index('custom_name').on(t.id)
   * ]);
   * ```
   */
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'singlestore'>) => SingleStoreTableExtraConfig): SingleStoreTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'singlestore'>;
    dialect: 'singlestore';
  }>;
  /**
   * @deprecated The third parameter of singlestoreTable is changing and will only accept an array instead of an object
   *
   * @example
   * Deprecated version:
   * ```ts
   * export const users = singlestoreTable("users", {
   * 	id: int(),
   * }, (t) => ({
   * 	idx: index('custom_name').on(t.id)
   * }));
   * ```
   *
   * New API:
   * ```ts
   * export const users = singlestoreTable("users", {
   * 	id: int(),
   * }, (t) => [
   * 	index('custom_name').on(t.id)
   * ]);
   * ```
   */
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: (columnTypes: SingleStoreColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'singlestore'>) => SingleStoreTableExtraConfig): SingleStoreTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'singlestore'>;
    dialect: 'singlestore';
  }>;
}
declare const singlestoreTable: SingleStoreTableFn;
declare function singlestoreTableCreator(customizeTableName: (name: string) => string): SingleStoreTableFn;
//#endregion
export { AnySingleStoreTable, SingleStoreTable, SingleStoreTableExtraConfig, SingleStoreTableExtraConfigValue, SingleStoreTableFn, SingleStoreTableWithColumns, TableConfig, singlestoreTable, singlestoreTableCreator, singlestoreTableWithSchema };
//# sourceMappingURL=table.d.cts.map