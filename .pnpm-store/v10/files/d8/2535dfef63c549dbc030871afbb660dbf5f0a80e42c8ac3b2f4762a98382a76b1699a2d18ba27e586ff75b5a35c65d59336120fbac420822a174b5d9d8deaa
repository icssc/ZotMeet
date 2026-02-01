import { GelIntColumnBaseBuilder } from "./int.common.cjs";
import { GelColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

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
//# sourceMappingURL=integer.d.cts.map