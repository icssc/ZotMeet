import { SingleStoreColumn, SingleStoreColumnBuilder, SingleStoreGeneratedColumnConfig } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";
import { SQL } from "../../sql/sql.js";
import { GeneratedColumnConfig, HasGenerated } from "../../column-builder.js";
import { AnySingleStoreTable } from "../table.js";

//#region src/singlestore-core/columns/datetime.d.ts
declare class SingleStoreDateTimeBuilder extends SingleStoreColumnBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | number;
}, SingleStoreDatetimeConfig> {
  generatedAlwaysAs(as: SQL | (() => SQL) | this['_']['data'], config?: SingleStoreGeneratedColumnConfig): HasGenerated<this, {
    type: 'always';
  }>;
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SingleStoreDateTime<T extends ColumnBaseConfig<'object date'>> extends SingleStoreColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnySingleStoreTable<{
    name: T['tableName'];
  }>, config: SingleStoreDateTimeBuilder['config']);
  getSQLType(): string;
  mapToDriverValue(value: Date | string): string;
  mapFromDriverValue(value: string): Date;
}
declare class SingleStoreDateTimeStringBuilder extends SingleStoreColumnBuilder<{
  dataType: 'string datetime';
  data: string;
  driverParam: string | number;
}, SingleStoreDatetimeConfig> {
  generatedAlwaysAs(_as: SQL | (() => SQL) | this['_']['data'], _config?: Partial<GeneratedColumnConfig<unknown>>): HasGenerated<this, {
    type: 'always';
  }>;
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SingleStoreDateTimeString<T extends ColumnBaseConfig<'string datetime'>> extends SingleStoreColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnySingleStoreTable<{
    name: T['tableName'];
  }>, config: SingleStoreDateTimeStringBuilder['config']);
  getSQLType(): string;
  mapToDriverValue(value: Date | string): string;
}
interface SingleStoreDatetimeConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
  mode?: TMode;
}
declare function datetime<TMode extends SingleStoreDatetimeConfig['mode'] & {}>(config?: SingleStoreDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreDateTimeStringBuilder : SingleStoreDateTimeBuilder;
declare function datetime<TMode extends SingleStoreDatetimeConfig['mode'] & {}>(name: string, config?: SingleStoreDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreDateTimeStringBuilder : SingleStoreDateTimeBuilder;
//#endregion
export { SingleStoreDateTime, SingleStoreDateTimeBuilder, SingleStoreDateTimeString, SingleStoreDateTimeStringBuilder, SingleStoreDatetimeConfig, datetime };
//# sourceMappingURL=datetime.d.ts.map