import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { AnyGelTable } from "../table.js";

//#region src/gel-core/columns/real.d.ts
declare class GelRealBuilder extends GelColumnBuilder<{
  dataType: 'number float';
  data: number;
  driverParam: number;
}, {
  length: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, length?: number);
}
declare class GelReal<T extends ColumnBaseConfig<'number float' | 'number ufloat'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  constructor(table: AnyGelTable<{
    name: T['tableName'];
  }>, config: GelRealBuilder['config']);
  getSQLType(): string;
}
declare function real(name?: string): GelRealBuilder;
//#endregion
export { GelReal, GelRealBuilder, real };
//# sourceMappingURL=real.d.ts.map