import { CheckBuilder } from "./checks.js";
import { AnyIndexBuilder } from "./indexes.js";
import { AnyPgColumnBuilder, PgBuildColumns, PgBuildExtraConfigColumns, PgColumns } from "./columns/common.js";
import { PgColumnsBuilders } from "./columns/all.js";
import { ForeignKeyBuilder } from "./foreign-keys.js";
import { PgPolicy } from "./policies.js";
import { PrimaryKeyBuilder } from "./primary-keys.js";
import { UniqueConstraintBuilder } from "./unique-constraint.js";
import { entityKind } from "../entity.js";
import { InferModelFromColumns, Table, TableConfig as TableConfig$1, UpdateTableConfig } from "../table.js";

//#region src/pg-core/table.d.ts
type PgTableExtraConfigValue = AnyIndexBuilder | CheckBuilder | ForeignKeyBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder | PgPolicy;
type PgTableExtraConfig = Record<string, PgTableExtraConfigValue>;
type TableConfig = TableConfig$1<PgColumns>;
declare class PgTable<out T extends TableConfig = TableConfig> extends Table<T> {
  static readonly [entityKind]: string;
}
type AnyPgTable<TPartial extends Partial<TableConfig> = {}> = PgTable<UpdateTableConfig<TableConfig, TPartial>>;
type PgTableWithColumns<T extends TableConfig> = PgTable<T> & T['columns'] & {
  readonly $inferSelect: InferModelFromColumns<T['columns'], 'select'>;
  readonly $inferInsert: InferModelFromColumns<T['columns'], 'insert'>;
} & {
  /** @deprecated use `pgTable.withRLS()` instead*/
  enableRLS: () => Omit<PgTableWithColumns<T>, 'enableRLS'>;
};
interface PgTableFnInternal<TSchema extends string | undefined = undefined> {
  <TTableName extends string, TColumnsMap extends Record<string, AnyPgColumnBuilder>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: PgBuildExtraConfigColumns<TColumnsMap>) => PgTableExtraConfigValue[]): PgTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: PgBuildColumns<TTableName, TColumnsMap>;
    dialect: 'pg';
  }>;
  <TTableName extends string, TColumnsMap extends Record<string, AnyPgColumnBuilder>>(name: TTableName, columns: (columnTypes: PgColumnsBuilders) => TColumnsMap, extraConfig?: (self: PgBuildExtraConfigColumns<TColumnsMap>) => PgTableExtraConfigValue[]): PgTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: PgBuildColumns<TTableName, TColumnsMap>;
    dialect: 'pg';
  }>;
  /**
   * @deprecated The third parameter of pgTable is changing and will only accept an array instead of an object
   *
   * @example
   * Deprecated version:
   * ```ts
   * export const users = pgTable("users", {
   * 	id: integer(),
   * }, (t) => ({
   * 	idx: index('custom_name').on(t.id)
   * }));
   * ```
   *
   * New API:
   * ```ts
   * export const users = pgTable("users", {
   * 	id: integer(),
   * }, (t) => [
   * 	index('custom_name').on(t.id)
   * ]);
   * ```
   */
  <TTableName extends string, TColumnsMap extends Record<string, AnyPgColumnBuilder>>(name: TTableName, columns: TColumnsMap, extraConfig: (self: PgBuildExtraConfigColumns<TColumnsMap>) => PgTableExtraConfig): PgTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: PgBuildColumns<TTableName, TColumnsMap>;
    dialect: 'pg';
  }>;
  /**
   * @deprecated The third parameter of pgTable is changing and will only accept an array instead of an object
   *
   * @example
   * Deprecated version:
   * ```ts
   * export const users = pgTable("users", {
   * 	id: integer(),
   * }, (t) => ({
   * 	idx: index('custom_name').on(t.id)
   * }));
   * ```
   *
   * New API:
   * ```ts
   * export const users = pgTable("users", {
   * 	id: integer(),
   * }, (t) => [
   * 	index('custom_name').on(t.id)
   * ]);
   * ```
   */
  <TTableName extends string, TColumnsMap extends Record<string, AnyPgColumnBuilder>>(name: TTableName, columns: (columnTypes: PgColumnsBuilders) => TColumnsMap, extraConfig: (self: PgBuildExtraConfigColumns<TColumnsMap>) => PgTableExtraConfig): PgTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: PgBuildColumns<TTableName, TColumnsMap>;
    dialect: 'pg';
  }>;
}
interface PgTableFn<TSchema extends string | undefined = undefined> extends PgTableFnInternal<TSchema> {
  withRLS: PgTableFnInternal<TSchema>;
}
declare const pgTable: PgTableFn;
declare function pgTableCreator(customizeTableName: (name: string) => string): PgTableFn;
//#endregion
export { AnyPgTable, PgTable, PgTableExtraConfig, PgTableExtraConfigValue, PgTableFn, PgTableFnInternal, PgTableWithColumns, TableConfig, pgTable, pgTableCreator };
//# sourceMappingURL=table.d.ts.map