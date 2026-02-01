import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/mysql-core/columns/year.d.ts
declare class MySqlYearBuilder extends MySqlColumnBuilder<{
  dataType: 'number year';
  data: number;
  driverParam: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class MySqlYear<T extends ColumnBaseConfig<'number year'>> extends MySqlColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function year(name?: string): MySqlYearBuilder;
//#endregion
export { MySqlYear, MySqlYearBuilder, year };
//# sourceMappingURL=year.d.ts.map