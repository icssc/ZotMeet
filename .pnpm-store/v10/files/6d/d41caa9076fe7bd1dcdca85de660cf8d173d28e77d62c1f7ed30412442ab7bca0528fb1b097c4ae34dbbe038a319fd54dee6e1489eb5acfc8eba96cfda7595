import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/mysql-core/columns/boolean.d.ts
declare class MySqlBooleanBuilder extends MySqlColumnBuilder<{
  dataType: 'boolean';
  data: boolean;
  driverParam: number | boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MySqlBoolean<T extends ColumnBaseConfig<'boolean'>> extends MySqlColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | boolean): boolean;
}
declare function boolean(name?: string): MySqlBooleanBuilder;
//#endregion
export { MySqlBoolean, MySqlBooleanBuilder, boolean };
//# sourceMappingURL=boolean.d.ts.map