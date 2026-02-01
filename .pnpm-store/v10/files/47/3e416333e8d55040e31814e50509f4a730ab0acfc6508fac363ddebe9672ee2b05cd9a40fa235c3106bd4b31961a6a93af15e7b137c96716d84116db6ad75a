import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";
import { AnyMySqlTable } from "../table.js";

//#region src/mysql-core/columns/date.d.ts
declare class MySqlDateBuilder extends MySqlColumnBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string | number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MySqlDate<T extends ColumnBaseConfig<'object date'>> extends MySqlColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnyMySqlTable<{
    name: T['tableName'];
  }>, config: MySqlDateBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: string): Date;
}
declare class MySqlDateStringBuilder extends MySqlColumnBuilder<{
  dataType: 'string date';
  data: string;
  driverParam: string | number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MySqlDateString<T extends ColumnBaseConfig<'string date'>> extends MySqlColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnyMySqlTable<{
    name: T['tableName'];
  }>, config: MySqlDateStringBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: Date | string): string;
}
interface MySqlDateConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
  mode?: TMode;
}
declare function date<TMode extends MySqlDateConfig['mode'] & {}>(config?: MySqlDateConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlDateStringBuilder : MySqlDateBuilder;
declare function date<TMode extends MySqlDateConfig['mode'] & {}>(name: string, config?: MySqlDateConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlDateStringBuilder : MySqlDateBuilder;
//#endregion
export { MySqlDate, MySqlDateBuilder, MySqlDateConfig, MySqlDateString, MySqlDateStringBuilder, date };
//# sourceMappingURL=date.d.ts.map