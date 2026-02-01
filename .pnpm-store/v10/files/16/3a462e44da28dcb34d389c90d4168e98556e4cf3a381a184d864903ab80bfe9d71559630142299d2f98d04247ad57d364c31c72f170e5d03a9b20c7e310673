import { CheckBuilder } from "./checks.cjs";
import { GelColumnsBuilders } from "./columns/all.cjs";
import { ForeignKeyBuilder } from "./foreign-keys.cjs";
import { GelPolicy } from "./policies.cjs";
import { PrimaryKeyBuilder } from "./primary-keys.cjs";
import { UniqueConstraintBuilder } from "./unique-constraint.cjs";
import { AnyIndexBuilder } from "./indexes.cjs";
import { GelColumns } from "./columns/common.cjs";
import { entityKind } from "../entity.cjs";
import { InferTableColumnsModels, Table, TableConfig as TableConfig$1, UpdateTableConfig } from "../table.cjs";
import { BuildColumns, BuildExtraConfigColumns, ColumnBuilderBase } from "../column-builder.cjs";

//#region src/gel-core/table.d.ts
type GelTableExtraConfigValue = AnyIndexBuilder | CheckBuilder | ForeignKeyBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder | GelPolicy;
type GelTableExtraConfig = Record<string, GelTableExtraConfigValue>;
type TableConfig = TableConfig$1<GelColumns>;
declare class GelTable<T extends TableConfig = TableConfig> extends Table<T> {
  static readonly [entityKind]: string;
}
type AnyGelTable<TPartial extends Partial<TableConfig> = {}> = GelTable<UpdateTableConfig<TableConfig, TPartial>>;
type GelTableWithColumns<T extends TableConfig> = GelTable<T> & T['columns'] & InferTableColumnsModels<T['columns']> & {
  enableRLS: () => Omit<GelTableWithColumns<T>, 'enableRLS'>;
};
interface GelTableFn<TSchema extends string | undefined = undefined> {
  /**
   * @deprecated The third parameter of GelTable is changing and will only accept an array instead of an object
   *
   * @example
   * Deprecated version:
   * ```ts
   * export const users = gelTable("users", {
   * 	id: integer(),
   * }, (t) => ({
   * 	idx: index('custom_name').on(t.id)
   * }));
   * ```
   *
   * New API:
   * ```ts
   * export const users = gelTable("users", {
   * 	id: integer(),
   * }, (t) => [
   * 	index('custom_name').on(t.id)
   * ]);
   * ```
   */
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'gel'>) => GelTableExtraConfig): GelTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'gel'>;
    dialect: 'gel';
  }>;
  /**
   * @deprecated The third parameter of gelTable is changing and will only accept an array instead of an object
   *
   * @example
   * Deprecated version:
   * ```ts
   * export const users = gelTable("users", {
   * 	id: integer(),
   * }, (t) => ({
   * 	idx: index('custom_name').on(t.id)
   * }));
   * ```
   *
   * New API:
   * ```ts
   * export const users = gelTable("users", {
   * 	id: integer(),
   * }, (t) => [
   * 	index('custom_name').on(t.id)
   * ]);
   * ```
   */
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: (columnTypes: GelColumnsBuilders) => TColumnsMap, extraConfig: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'gel'>) => GelTableExtraConfig): GelTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'gel'>;
    dialect: 'gel';
  }>;
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'gel'>) => GelTableExtraConfigValue[]): GelTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'gel'>;
    dialect: 'gel';
  }>;
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: (columnTypes: GelColumnsBuilders) => TColumnsMap, extraConfig?: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'gel'>) => GelTableExtraConfigValue[]): GelTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'gel'>;
    dialect: 'gel';
  }>;
}
declare const gelTable: GelTableFn;
declare function gelTableCreator(customizeTableName: (name: string) => string): GelTableFn;
//#endregion
export { AnyGelTable, GelTable, GelTableExtraConfig, GelTableExtraConfigValue, GelTableFn, GelTableWithColumns, TableConfig, gelTable, gelTableCreator };
//# sourceMappingURL=table.d.cts.map