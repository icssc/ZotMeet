import { GelIntColumnBaseBuilder } from "./int.common.js";
import { GelColumn } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/gel-core/columns/bigint.d.ts
declare class GelInt53Builder extends GelIntColumnBaseBuilder<{
  dataType: 'number int53';
  data: number;
  driverParam: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelInt53<T extends ColumnBaseConfig<'number int53'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function bigint(name?: string): GelInt53Builder;
//#endregion
export { GelInt53, GelInt53Builder, bigint };
//# sourceMappingURL=bigint.d.ts.map