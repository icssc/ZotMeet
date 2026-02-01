import { CheckBuilder } from "./checks.cjs";
import { AnyIndexBuilder } from "./indexes.cjs";
import { AnyPgColumnBuilder, PgBuildColumns, PgBuildExtraConfigColumns, PgColumns } from "./columns/common.cjs";
import { PgColumnsBuilders } from "./columns/all.cjs";
import { ForeignKeyBuilder } from "./foreign-keys.cjs";
import { PgPolicy } from "./policies.cjs";
import { PrimaryKeyBuilder } from "./primary-keys.cjs";
import { UniqueConstraintBuilder } from "./unique-constraint.cjs";
import { entityKind } from "../entity.cjs";
import { InferModelFromColumns, Table, TableConfig as TableConfig$1, UpdateTableConfig } from "../table.cjs";

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
//# sourceMappingURL=table.d.cts.map