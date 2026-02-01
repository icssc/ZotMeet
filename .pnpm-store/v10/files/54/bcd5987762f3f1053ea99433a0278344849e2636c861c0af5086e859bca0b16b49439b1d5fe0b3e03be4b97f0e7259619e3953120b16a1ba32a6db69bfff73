import { SQLiteColumn, SQLiteColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/sqlite-core/columns/real.d.ts
declare class SQLiteRealBuilder extends SQLiteColumnBuilder<{
  dataType: 'number double';
  data: number;
  driverParam: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SQLiteReal<T extends ColumnBaseConfig<'number double'>> extends SQLiteColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function real(name?: string): SQLiteRealBuilder;
//#endregion
export { SQLiteReal, SQLiteRealBuilder, real };
//# sourceMappingURL=real.d.ts.map