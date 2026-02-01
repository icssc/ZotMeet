import { GelColumn, GelColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

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
//# sourceMappingURL=boolean.d.cts.map