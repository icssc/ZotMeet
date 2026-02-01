import { MsSqlColumns } from "./columns/common.js";
import { CheckBuilder } from "./checks.js";
import { MsSqlColumnBuilders } from "./columns/all.js";
import { ForeignKeyBuilder } from "./foreign-keys.js";
import { AnyIndexBuilder } from "./indexes.js";
import { PrimaryKeyBuilder } from "./primary-keys.js";
import { UniqueConstraintBuilder } from "./unique-constraint.js";
import { entityKind } from "../entity.js";
import { InferTableColumnsModels, Table, TableConfig as TableConfig$1, UpdateTableConfig } from "../table.js";
import { BuildColumns, BuildExtraConfigColumns, ColumnBuilderBase } from "../column-builder.js";

//#region src/mssql-core/table.d.ts
type MsSqlTableExtraConfigValue = AnyIndexBuilder | CheckBuilder | ForeignKeyBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder;
type MsSqlTableExtraConfig = Record<string, MsSqlTableExtraConfigValue>;
type TableConfig = TableConfig$1<MsSqlColumns>;
declare class MsSqlTable<T extends TableConfig = TableConfig> extends Table<T> {
  static readonly [entityKind]: string;
}
type AnyMsSqlTable<TPartial extends Partial<TableConfig> = {}> = MsSqlTable<UpdateTableConfig<TableConfig, TPartial>>;
type MsSqlTableWithColumns<T extends TableConfig> = MsSqlTable<T> & T['columns'] & InferTableColumnsModels<T['columns']>;
declare function mssqlTableWithSchema<TTableName extends string, TSchemaName extends string | undefined, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap | ((columnTypes: MsSqlColumnBuilders) => TColumnsMap), extraConfig: ((self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'mssql'>) => MsSqlTableExtraConfig | MsSqlTableExtraConfigValue[]) | undefined, schema: TSchemaName, baseName?: TTableName): MsSqlTableWithColumns<{
  name: TTableName;
  schema: TSchemaName;
  columns: BuildColumns<TTableName, TColumnsMap, 'mssql'>;
  dialect: 'mssql';
}>;
interface MsSqlTableFn<TSchema extends string | undefined = undefined> {
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'mssql'>) => MsSqlTableExtraConfigValue[]): MsSqlTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'mssql'>;
    dialect: 'mssql';
  }>;
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: (columnTypes: MsSqlColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'mssql'>) => MsSqlTableExtraConfigValue[]): MsSqlTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'mssql'>;
    dialect: 'mssql';
  }>;
}
declare const mssqlTable: MsSqlTableFn;
declare function mssqlTableCreator(customizeTableName: (name: string) => string): MsSqlTableFn;
//#endregion
export { AnyMsSqlTable, MsSqlTable, MsSqlTableExtraConfig, MsSqlTableExtraConfigValue, MsSqlTableFn, MsSqlTableWithColumns, TableConfig, mssqlTable, mssqlTableCreator, mssqlTableWithSchema };
//# sourceMappingURL=table.d.ts.map