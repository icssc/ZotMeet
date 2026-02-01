import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { AnySingleStoreTable } from "../table.cjs";

//#region src/singlestore-core/columns/date.d.ts
declare class SingleStoreDateBuilder extends SingleStoreColumnBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SingleStoreDate<T extends ColumnBaseConfig<'object date'>> extends SingleStoreColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnySingleStoreTable<{
    name: T['tableName'];
  }>, config: SingleStoreDateBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: string): Date;
}
declare class SingleStoreDateStringBuilder extends SingleStoreColumnBuilder<{
  dataType: 'string date';
  data: string;
  driverParam: string | number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SingleStoreDateString<T extends ColumnBaseConfig<'string date'>> extends SingleStoreColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnySingleStoreTable<{
    name: T['tableName'];
  }>, config: SingleStoreDateStringBuilder['config']);
  getSQLType(): string;
}
interface SingleStoreDateConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
  mode?: TMode;
}
declare function date<TMode extends SingleStoreDateConfig['mode'] & {}>(config?: SingleStoreDateConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreDateStringBuilder : SingleStoreDateBuilder;
declare function date<TMode extends SingleStoreDateConfig['mode'] & {}>(name: string, config?: SingleStoreDateConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreDateStringBuilder : SingleStoreDateBuilder;
//#endregion
export { SingleStoreDate, SingleStoreDateBuilder, SingleStoreDateConfig, SingleStoreDateString, SingleStoreDateStringBuilder, date };
//# sourceMappingURL=date.d.cts.map