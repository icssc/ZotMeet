import { entityKind } from "./entity.js";
import { OptionalKeyOnly, RequiredKeyOnly } from "./operations.js";
import { Simplify, Update } from "./utils.js";
import { View } from "./sql/sql.js";
import { Column, Columns, GetColumnData } from "./column.js";

//#region src/table.d.ts
interface TableConfig<TColumns extends Columns = Columns> {
  name: string;
  schema: string | undefined;
  columns: TColumns;
  dialect: string;
}
type UpdateTableConfig<T extends TableConfig, TUpdate extends Partial<TableConfig>> = Required<Update<T, TUpdate>>;
interface TableTypeConfig<T extends TableConfig> {
  readonly brand: 'Table';
  readonly name: T['name'];
  readonly schema: T['schema'];
  readonly columns: T['columns'];
  readonly dialect: T['dialect'];
}
declare class Table<out T extends TableConfig = TableConfig> {
  static readonly [entityKind]: string;
  readonly _: TableTypeConfig<T>;
  constructor(name: string, schema: string | undefined, baseName: string);
}
declare function isTable(table: unknown): table is Table;
/**
 * Any table with a specified boundary.
 *
 * @example
    ```ts
    // Any table with a specific name
    type AnyUsersTable = AnyTable<{ name: 'users' }>;
    ```
 *
 * To describe any table with any config, simply use `Table` without any type arguments, like this:
 *
    ```ts
    function needsTable(table: Table) {
        ...
    }
    ```
 */
type AnyTable<TPartial extends Partial<TableConfig>> = Table<UpdateTableConfig<TableConfig, TPartial>>;
declare function getTableName<T extends Table>(table: T): T['_']['name'];
declare function getTableUniqueName<T extends Table | View, TResult extends string = (T extends Table ? T['_']['schema'] extends undefined ? `public.${T['_']['name']}` : `${T['_']['schema']}.${T['_']['name']}` : `${string}.${T['_']['name']}`)>(table: T): TResult;
type MapColumnName<TName extends string, TColumn extends Column, TDBColumNames extends boolean> = TDBColumNames extends true ? TColumn['_']['name'] : TName;
type InferModelFromColumns<TColumns extends Columns, TInferMode extends 'select' | 'insert' = 'select', TConfig extends {
  override?: boolean;
} = {
  dbColumnNames: false;
  override: false;
}> = Simplify<TInferMode extends 'insert' ? { [Key in keyof TColumns & string as RequiredKeyOnly<Key, TColumns[Key]>]: GetColumnData<TColumns[Key], 'query'> } & { [Key in keyof TColumns & string as OptionalKeyOnly<Key, TColumns[Key], TConfig['override']>]?: GetColumnData<TColumns[Key], 'query'> | undefined } : { [Key in keyof TColumns & string]: GetColumnData<TColumns[Key], 'query'> }>;
/** @deprecated Use one of the alternatives: {@link InferSelectModel} / {@link InferInsertModel}, or `table.$inferSelect` / `table.$inferInsert`
 */
type InferModel<TTable extends Table, TInferMode extends 'select' | 'insert' = 'select'> = InferModelFromColumns<TTable['_']['columns'], TInferMode>;
type InferSelectModel<TTable extends Table> = InferModelFromColumns<TTable['_']['columns'], 'select'>;
type InferInsertModel<TTable extends Table, TOverride extends {
  override?: boolean;
} = {
  override: false;
}> = InferModelFromColumns<TTable['_']['columns'], 'insert', TOverride>;
type InferEnum<T> = T extends {
  enumValues: readonly (infer U)[];
} ? U : never;
interface InferTableColumnsModels<TColumns extends Columns> {
  readonly $inferSelect: InferModelFromColumns<TColumns, 'select'>;
  readonly $inferInsert: InferModelFromColumns<TColumns, 'insert', {
    override: false;
  }>;
}
//#endregion
export { AnyTable, InferEnum, InferInsertModel, InferModel, InferModelFromColumns, InferSelectModel, InferTableColumnsModels, MapColumnName, Table, TableConfig, TableTypeConfig, UpdateTableConfig, getTableName, getTableUniqueName, isTable };
//# sourceMappingURL=table.d.ts.map