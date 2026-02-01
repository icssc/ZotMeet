import { GelIntColumnBaseBuilder } from "./int.common.cjs";
import { GelColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/gel-core/columns/bigintT.d.ts
declare class GelBigInt64Builder extends GelIntColumnBaseBuilder<{
  dataType: 'bigint int64';
  data: bigint;
  driverParam: bigint;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelBigInt64<T extends ColumnBaseConfig<'bigint int64'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string): bigint;
}
declare function bigintT(name?: string): GelBigInt64Builder;
//#endregion
export { GelBigInt64, GelBigInt64Builder, bigintT };
//# sourceMappingURL=bigintT.d.cts.map