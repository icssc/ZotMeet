import { GelIntColumnBaseBuilder } from "./int.common.js";
import { GelColumn } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/gel-core/columns/integer.d.ts
declare class GelIntegerBuilder extends GelIntColumnBaseBuilder<{
  dataType: 'number int32';
  data: number;
  driverParam: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelInteger<T extends ColumnBaseConfig<'number int32' | 'number uint32'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function integer(name?: string): GelIntegerBuilder;
//#endregion
export { GelInteger, GelIntegerBuilder, integer };
//# sourceMappingURL=integer.d.ts.map