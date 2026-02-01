import { GelIntColumnBaseBuilder } from "./int.common.cjs";
import { GelColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

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
//# sourceMappingURL=bigint.d.cts.map