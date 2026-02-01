import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/varbinary.d.ts
declare class SingleStoreVarBinaryBuilder extends SingleStoreColumnBuilder<{
  dataType: 'string binary';
  data: string;
  driverParam: string;
}, SingleStoreVarbinaryOptions> {
  static readonly [entityKind]: string;
}
declare class SingleStoreVarBinary<T extends ColumnBaseConfig<'string binary'>> extends SingleStoreColumn<T, SingleStoreVarbinaryOptions> {
  static readonly [entityKind]: string;
  mapFromDriverValue(value: string | Buffer | Uint8Array): string;
  getSQLType(): string;
}
interface SingleStoreVarbinaryOptions {
  length: number;
}
declare function varbinary(config: SingleStoreVarbinaryOptions): SingleStoreVarBinaryBuilder;
declare function varbinary(name: string, config: SingleStoreVarbinaryOptions): SingleStoreVarBinaryBuilder;
//#endregion
export { SingleStoreVarBinary, SingleStoreVarBinaryBuilder, SingleStoreVarbinaryOptions, varbinary };
//# sourceMappingURL=varbinary.d.cts.map