import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/gel-core/columns/boolean.d.ts
declare class GelBooleanBuilder extends GelColumnBuilder<{
  dataType: 'boolean';
  data: boolean;
  driverParam: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelBoolean<T extends ColumnBaseConfig<'boolean'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function boolean(name?: string): GelBooleanBuilder;
//#endregion
export { GelBoolean, GelBooleanBuilder, boolean };
//# sourceMappingURL=boolean.d.ts.map