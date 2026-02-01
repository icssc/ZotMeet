import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/gel-core/columns/bytes.d.ts
declare class GelBytesBuilder extends GelColumnBuilder<{
  dataType: 'object buffer';
  data: Uint8Array;
  driverParam: Uint8Array | Buffer;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelBytes<T extends ColumnBaseConfig<'object buffer'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function bytes(name?: string): GelBytesBuilder;
//#endregion
export { GelBytes, GelBytesBuilder, bytes };
//# sourceMappingURL=bytes.d.ts.map