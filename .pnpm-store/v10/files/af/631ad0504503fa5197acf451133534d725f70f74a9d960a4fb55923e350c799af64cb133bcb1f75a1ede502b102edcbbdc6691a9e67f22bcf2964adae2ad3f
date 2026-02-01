import { CockroachColumns } from "./columns/common.js";
import { CheckBuilder } from "./checks.js";
import { CockroachColumnsBuilders } from "./columns/all.js";
import { ForeignKeyBuilder } from "./foreign-keys.js";
import { AnyIndexBuilder } from "./indexes.js";
import { CockroachPolicy } from "./policies.js";
import { PrimaryKeyBuilder } from "./primary-keys.js";
import { UniqueConstraintBuilder } from "./unique-constraint.js";
import { entityKind } from "../entity.js";
import { InferTableColumnsModels, Table, TableConfig as TableConfig$1, UpdateTableConfig } from "../table.js";
import { BuildColumns, BuildExtraConfigColumns, ColumnBuilderBase } from "../column-builder.js";

//#region src/cockroach-core/table.d.ts
type CockroachTableExtraConfigValue = AnyIndexBuilder | CheckBuilder | ForeignKeyBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder | CockroachPolicy;
type CockroachTableExtraConfig = Record<string, CockroachTableExtraConfigValue>;
type TableConfig = TableConfig$1<CockroachColumns>;
declare class CockroachTable<T extends TableConfig = TableConfig> extends Table<T> {
  static readonly [entityKind]: string;
}
type AnyCockroachTable<TPartial extends Partial<TableConfig> = {}> = CockroachTable<UpdateTableConfig<TableConfig, TPartial>>;
type CockroachTableWithColumns<T extends TableConfig> = CockroachTable<T> & T['columns'] & InferTableColumnsModels<T['columns']> & {
  /** @deprecated use `cockroachTable.withRLS()` instead*/
  enableRLS: () => Omit<CockroachTableWithColumns<T>, 'enableRLS'>;
};
interface CockroachTableFnInternal<TSchema extends string | undefined = undefined> {
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'cockroach'>) => CockroachTableExtraConfigValue[]): CockroachTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'cockroach'>;
    dialect: 'cockroach';
  }>;
  <TTableName extends string, TColumnsMap extends Record<string, ColumnBuilderBase>>(name: TTableName, columns: (columnTypes: CockroachColumnsBuilders) => TColumnsMap, extraConfig?: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'cockroach'>) => CockroachTableExtraConfigValue[]): CockroachTableWithColumns<{
    name: TTableName;
    schema: TSchema;
    columns: BuildColumns<TTableName, TColumnsMap, 'cockroach'>;
    dialect: 'cockroach';
  }>;
}
interface CockroachTableFn<TSchema extends string | undefined = undefined> extends CockroachTableFnInternal<TSchema> {
  withRLS: CockroachTableFnInternal<TSchema>;
}
declare const cockroachTable: CockroachTableFn;
declare function cockroachTableCreator(customizeTableName: (name: string) => string): CockroachTableFn;
//#endregion
export { AnyCockroachTable, CockroachTable, CockroachTableExtraConfig, CockroachTableExtraConfigValue, CockroachTableFn, CockroachTableFnInternal, CockroachTableWithColumns, TableConfig, cockroachTable, cockroachTableCreator };
//# sourceMappingURL=table.d.ts.map