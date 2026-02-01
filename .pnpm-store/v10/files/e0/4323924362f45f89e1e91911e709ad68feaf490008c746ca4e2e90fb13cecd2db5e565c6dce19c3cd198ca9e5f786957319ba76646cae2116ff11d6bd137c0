import { entityKind } from "./entity.js";
import { Update } from "./utils.js";
import { Table } from "./table.js";
import { DriverValueMapper, SQL, SQLWrapper } from "./sql/sql.js";
import { ColumnBuilderRuntimeConfig, ColumnType, GeneratedColumnConfig, GeneratedIdentityConfig } from "./column-builder.js";

//#region src/column.d.ts
type Columns = Record<string, Column<any>>;
interface ColumnBaseConfig<TDataType extends ColumnType> {
  name: string;
  dataType: TDataType;
  tableName: string;
  notNull: boolean;
  hasDefault: boolean;
  isPrimaryKey: boolean;
  isAutoincrement: boolean;
  hasRuntimeDefault: boolean;
  data: unknown;
  driverParam: unknown;
  enumValues: string[] | undefined;
  generated: unknown;
  identity: undefined | 'always' | 'byDefault';
}
interface Column<out T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, out TRuntimeConfig extends object = object> extends DriverValueMapper<T['data'], T['driverParam']>, SQLWrapper {
  as(alias: string): this;
}
declare abstract class Column<out T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, out TRuntimeConfig extends object = object> implements DriverValueMapper<T['data'], T['driverParam']>, SQLWrapper {
  static readonly [entityKind]: string;
  readonly _: T;
  readonly name: string;
  readonly keyAsName: boolean;
  readonly primary: boolean;
  readonly notNull: boolean;
  readonly default: T['data'] | SQL | undefined;
  readonly defaultFn: (() => T['data'] | SQL) | undefined;
  readonly onUpdateFn: (() => T['data'] | SQL) | undefined;
  readonly hasDefault: boolean;
  readonly isUnique: boolean;
  readonly uniqueName: string | undefined;
  readonly uniqueType: string | undefined;
  readonly dataType: T['dataType'];
  readonly columnType: string;
  readonly enumValues: T['enumValues'];
  readonly generated: GeneratedColumnConfig<T['data']> | undefined;
  readonly generatedIdentity: GeneratedIdentityConfig | undefined;
  readonly length: number | undefined;
  readonly isLengthExact: boolean | undefined;
  readonly isAlias: boolean;
  constructor(table: Table, config: ColumnBuilderRuntimeConfig<T['data']> & TRuntimeConfig);
  abstract getSQLType(): string;
  mapFromDriverValue(value: unknown): unknown;
  mapToDriverValue(value: unknown): unknown;
}
type UpdateColConfig<T extends ColumnBaseConfig<ColumnType>, TUpdate extends Partial<ColumnBaseConfig<ColumnType>>> = Update<T, TUpdate>;
type AnyColumn<TPartial extends Partial<ColumnBaseConfig<ColumnType>> = {}> = Column<Required<Update<ColumnBaseConfig<ColumnType>, TPartial>>>;
type GetColumnData<TColumn extends Column, TInferMode extends 'query' | 'raw' = 'query'> = TInferMode extends 'raw' ? TColumn['_']['data'] : TColumn['_']['notNull'] extends true ? TColumn['_']['data'] : TColumn['_']['data'] | null;
type InferColumnsDataTypes<TColumns extends Record<string, Column>> = { [Key in keyof TColumns]: GetColumnData<TColumns[Key], 'query'> };
declare function getColumnTable<TTable extends Table<any> = Table<any>>(column: Column<any>): TTable;
//#endregion
export { AnyColumn, Column, ColumnBaseConfig, Columns, GetColumnData, InferColumnsDataTypes, UpdateColConfig, getColumnTable };
//# sourceMappingURL=column.d.ts.map