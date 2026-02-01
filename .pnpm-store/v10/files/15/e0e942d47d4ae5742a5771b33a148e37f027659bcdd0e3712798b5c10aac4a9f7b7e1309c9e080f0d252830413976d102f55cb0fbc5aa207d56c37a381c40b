import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/binary.d.ts
declare class SingleStoreBinaryBuilder extends SingleStoreColumnBuilder<{
  dataType: 'string binary';
  data: string;
  driverParam: string;
}, SingleStoreBinaryConfig & {
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, length: number | undefined);
}
declare class SingleStoreBinary<T extends ColumnBaseConfig<'string binary'>> extends SingleStoreColumn<T, SingleStoreBinaryConfig & {
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  mapFromDriverValue(value: string | Buffer | Uint8Array): string;
  getSQLType(): string;
}
interface SingleStoreBinaryConfig {
  length?: number;
}
declare function binary(config?: SingleStoreBinaryConfig): SingleStoreBinaryBuilder;
declare function binary(name: string, config?: SingleStoreBinaryConfig): SingleStoreBinaryBuilder;
//#endregion
export { SingleStoreBinary, SingleStoreBinaryBuilder, SingleStoreBinaryConfig, binary };
//# sourceMappingURL=binary.d.cts.map