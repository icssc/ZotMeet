import { GelIndexOpClass } from "../indexes.cjs";
import { entityKind } from "../../entity.cjs";
import { SQL } from "../../sql/sql.cjs";
import { Simplify, Update } from "../../utils.cjs";
import { Column, ColumnBaseConfig } from "../../column.cjs";
import { ColumnBuilder, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnType, HasGenerated } from "../../column-builder.cjs";
import { AnyGelTable, GelTable } from "../table.cjs";
import { UpdateDeleteAction } from "../foreign-keys.cjs";

//#region src/gel-core/columns/common.d.ts
type GelColumns = Record<string, GelColumn<any>>;
interface ReferenceConfig {
  ref: () => GelColumn;
  actions: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  };
}
declare abstract class GelColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends ColumnBuilder<T, TRuntimeConfig, TExtraConfig> {
  private foreignKeyConfigs;
  static readonly [entityKind]: string;
  array(length?: number): GelArrayBuilder<{
    name: string;
    dataType: 'array basecolumn';
    data: T['data'][];
    driverParam: T['driverParam'][] | string;
    baseBuilder: T;
  } & (T extends {
    notNull: true;
  } ? {
    notNull: true;
  } : {}) & (T extends {
    hasDefault: true;
  } ? {
    hasDefault: true;
  } : {}), T>;
  references(ref: ReferenceConfig['ref'], actions?: ReferenceConfig['actions']): this;
  unique(name?: string, config?: {
    nulls: 'distinct' | 'not distinct';
  }): this;
  generatedAlwaysAs(as: SQL | (() => SQL)): HasGenerated<this, {
    type: 'always';
  }>;
}
declare abstract class GelColumn<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = {}> extends Column<T, TRuntimeConfig> {
  static readonly [entityKind]: string;
  constructor(table: GelTable, config: ColumnBuilderRuntimeConfig<T['data']> & TRuntimeConfig);
}
type IndexedExtraConfigType = {
  order?: 'asc' | 'desc';
  nulls?: 'first' | 'last';
  opClass?: string;
};
declare class GelExtraConfigColumn<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>> extends GelColumn<T, IndexedExtraConfigType> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  indexConfig: IndexedExtraConfigType;
  defaultConfig: IndexedExtraConfigType;
  asc(): Omit<this, 'asc' | 'desc'>;
  desc(): Omit<this, 'asc' | 'desc'>;
  nullsFirst(): Omit<this, 'nullsFirst' | 'nullsLast'>;
  nullsLast(): Omit<this, 'nullsFirst' | 'nullsLast'>;
  /**
   * ### PostgreSQL documentation quote
   *
   * > An operator class with optional parameters can be specified for each column of an index.
   * The operator class identifies the operators to be used by the index for that column.
   * For example, a B-tree index on four-byte integers would use the int4_ops class;
   * this operator class includes comparison functions for four-byte integers.
   * In practice the default operator class for the column's data type is usually sufficient.
   * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
   * For example, we might want to sort a complex-number data type either by absolute value or by real part.
   * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
   * More information about operator classes check:
   *
   * ### Useful links
   * https://www.postgresql.org/docs/current/sql-createindex.html
   *
   * https://www.postgresql.org/docs/current/indexes-opclass.html
   *
   * https://www.postgresql.org/docs/current/xindex.html
   *
   * ### Additional types
   * If you have the `Gel_vector` extension installed in your database, you can use the
   * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
   *
   * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
   *
   * @param opClass
   * @returns
   */
  op(opClass: GelIndexOpClass): Omit<this, 'op'>;
}
declare class IndexedColumn {
  static readonly [entityKind]: string;
  constructor(name: string | undefined, keyAsName: boolean, type: string, indexConfig: IndexedExtraConfigType);
  name: string | undefined;
  keyAsName: boolean;
  type: string;
  indexConfig: IndexedExtraConfigType;
}
type AnyGelColumn<TPartial extends Partial<ColumnBaseConfig<ColumnType>> = {}> = GelColumn<Required<Update<ColumnBaseConfig<ColumnType>, TPartial>>>;
type GelArrayColumnBuilderBaseConfig = ColumnBuilderBaseConfig<'array basecolumn'> & {
  baseBuilder: ColumnBuilderBaseConfig<ColumnType>;
};
declare class GelArrayBuilder<T extends GelArrayColumnBuilderBaseConfig, TBase extends ColumnBuilderBaseConfig<ColumnType> | GelArrayColumnBuilderBaseConfig> extends GelColumnBuilder<T & {
  baseBuilder: TBase extends GelArrayColumnBuilderBaseConfig ? GelArrayBuilder<TBase, TBase extends {
    baseBuilder: infer TBaseBuilder extends ColumnBuilderBaseConfig<any>;
  } ? TBaseBuilder : never> : GelColumnBuilder<TBase, {}, Simplify<Omit<TBase, keyof ColumnBuilderBaseConfig<any>>>>;
}, {
  baseBuilder: TBase extends GelArrayColumnBuilderBaseConfig ? GelArrayBuilder<TBase, TBase extends {
    baseBuilder: infer TBaseBuilder extends ColumnBuilderBaseConfig<any>;
  } ? TBaseBuilder : never> : GelColumnBuilder<TBase, {}, Simplify<Omit<TBase, keyof ColumnBuilderBaseConfig<any>>>>;
  length: number | undefined;
}, {}> {
  static readonly [entityKind]: string;
  constructor(name: string, baseBuilder: GelArrayBuilder<T, TBase>['config']['baseBuilder'], length: number | undefined);
}
declare class GelArray<T extends ColumnBaseConfig<'array basecolumn'> & {
  length: number | undefined;
  baseBuilder: ColumnBuilderBaseConfig<ColumnType>;
}, TBase extends ColumnBuilderBaseConfig<ColumnType>> extends GelColumn<T, {}> {
  readonly baseColumn: GelColumn;
  readonly range?: [number | undefined, number | undefined] | undefined;
  static readonly [entityKind]: string;
  constructor(table: AnyGelTable<{
    name: T['tableName'];
  }>, config: GelArrayBuilder<T, TBase>['config'], baseColumn: GelColumn, range?: [number | undefined, number | undefined] | undefined);
  mapFromDriverValue(value: unknown[]): T['data'];
  mapFromJsonValue(value: unknown[]): T['data'];
  getSQLType(): string;
}
//#endregion
export { AnyGelColumn, GelArray, GelArrayBuilder, GelArrayColumnBuilderBaseConfig, GelColumn, GelColumnBuilder, GelColumns, GelExtraConfigColumn, IndexedColumn, IndexedExtraConfigType, ReferenceConfig };
//# sourceMappingURL=common.d.cts.map