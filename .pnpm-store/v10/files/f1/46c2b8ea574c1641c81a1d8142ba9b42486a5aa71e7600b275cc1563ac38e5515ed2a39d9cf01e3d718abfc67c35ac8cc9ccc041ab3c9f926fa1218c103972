import { entityKind } from "../../entity.js";
import { Column, ColumnBaseConfig } from "../../column.js";
import { Update } from "../../utils.js";
import { SQL } from "../../sql/sql.js";
import { ColumnBuilder, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, ColumnType, HasGenerated } from "../../column-builder.js";
import { UpdateDeleteAction } from "../foreign-keys.js";
import { CockroachTable } from "../table.js";

//#region src/cockroach-core/columns/common.d.ts
type CockroachColumns = Record<string, CockroachColumn<any>>;
interface ReferenceConfig {
  ref: () => CockroachColumn;
  config: {
    name?: string;
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  };
}
declare abstract class CockroachColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object> extends ColumnBuilder<T, TRuntimeConfig> {
  private foreignKeyConfigs;
  static readonly [entityKind]: string;
  references(ref: ReferenceConfig['ref'], config?: ReferenceConfig['config']): this;
  unique(name?: string): this;
  generatedAlwaysAs(as: SQL | (() => SQL)): HasGenerated<this, {
    type: 'always';
  }>;
}
declare abstract class CockroachColumnWithArrayBuilder<T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object> extends CockroachColumnBuilder<T, TRuntimeConfig> {
  static readonly [entityKind]: string;
  array<TSize extends number | undefined = undefined>(size?: TSize): Omit<CockroachArrayBuilder<{
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
  } : {}), T>, 'array'>;
}
declare abstract class CockroachColumn<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>, TRuntimeConfig extends object = {}> extends Column<T, TRuntimeConfig> {
  static readonly [entityKind]: string;
  constructor(table: CockroachTable, config: ColumnBuilderRuntimeConfig<T['data']> & TRuntimeConfig);
}
type IndexedExtraConfigType = {
  order?: 'asc' | 'desc';
};
declare class ExtraConfigColumn<T extends ColumnBaseConfig<ColumnType> = ColumnBaseConfig<ColumnType>> extends CockroachColumn<T, IndexedExtraConfigType> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  indexConfig: IndexedExtraConfigType;
  defaultConfig: IndexedExtraConfigType;
  asc(): Omit<this, 'asc' | 'desc'>;
  desc(): Omit<this, 'asc' | 'desc'>;
}
declare class IndexedColumn {
  static readonly [entityKind]: string;
  constructor(name: string | undefined, keyAsName: boolean, type: string, indexConfig: IndexedExtraConfigType);
  name: string | undefined;
  keyAsName: boolean;
  type: string;
  indexConfig: IndexedExtraConfigType;
}
type AnyCockroachColumn<TPartial extends Partial<ColumnBaseConfig<ColumnType>> = {}> = CockroachColumn<Required<Update<ColumnBaseConfig<ColumnType>, TPartial>>>;
type CockroachArrayColumnBuilderBaseConfig = ColumnBuilderBaseConfig<'array basecolumn'> & {
  baseBuilder: ColumnBuilderBaseConfig<ColumnType>;
};
declare class CockroachArrayBuilder<T extends CockroachArrayColumnBuilderBaseConfig, TBase extends ColumnBuilderBaseConfig<ColumnType> | CockroachArrayColumnBuilderBaseConfig> extends CockroachColumnWithArrayBuilder<T & {
  baseBuilder: TBase extends CockroachArrayColumnBuilderBaseConfig ? CockroachArrayBuilder<TBase, TBase extends {
    baseBuilder: infer TBaseBuilder extends ColumnBuilderBaseConfig<any>;
  } ? TBaseBuilder : never> : CockroachColumnWithArrayBuilder<TBase, {}>;
}, {
  baseBuilder: TBase extends CockroachArrayColumnBuilderBaseConfig ? CockroachArrayBuilder<TBase, TBase extends {
    baseBuilder: infer TBaseBuilder extends ColumnBuilderBaseConfig<any>;
  } ? TBaseBuilder : never> : CockroachColumnWithArrayBuilder<TBase, {}>;
  length: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, baseBuilder: CockroachArrayBuilder<T, TBase>['config']['baseBuilder'], length: number | undefined);
}
declare class CockroachArray<T extends ColumnBaseConfig<'array basecolumn'> & {
  length: number | undefined;
  baseBuilder: ColumnBuilderBaseConfig<ColumnType>;
}, TBase extends ColumnBuilderBaseConfig<ColumnType>> extends CockroachColumn<T, {}> {
  readonly baseColumn: CockroachColumn;
  readonly range?: [number | undefined, number | undefined] | undefined;
  static readonly [entityKind]: string;
  constructor(table: CockroachTable<any>, config: CockroachArrayBuilder<T, TBase>['config'], baseColumn: CockroachColumn, range?: [number | undefined, number | undefined] | undefined);
  getSQLType(): string;
  mapFromDriverValue(value: unknown[] | string): T['data'];
  mapFromJsonValue(value: unknown[] | string): T['data'];
  mapToDriverValue(value: unknown[], isNestedArray?: boolean): unknown[] | string;
}
//#endregion
export { AnyCockroachColumn, CockroachArray, CockroachArrayBuilder, CockroachArrayColumnBuilderBaseConfig, CockroachColumn, CockroachColumnBuilder, CockroachColumnWithArrayBuilder, CockroachColumns, ExtraConfigColumn, IndexedColumn, IndexedExtraConfigType, ReferenceConfig };
//# sourceMappingURL=common.d.ts.map