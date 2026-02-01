import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/singlestore-core/columns/real.d.ts
declare class SingleStoreRealBuilder extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: 'number double';
  data: number;
  driverParam: number | string;
}, SingleStoreRealConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: SingleStoreRealConfig | undefined);
}
declare class SingleStoreReal<T extends ColumnBaseConfig<'number double'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreRealConfig> {
  static readonly [entityKind]: string;
  precision: number | undefined;
  scale: number | undefined;
  getSQLType(): string;
}
interface SingleStoreRealConfig {
  precision?: number;
  scale?: number;
}
declare function real(config?: SingleStoreRealConfig): SingleStoreRealBuilder;
declare function real(name: string, config?: SingleStoreRealConfig): SingleStoreRealBuilder;
//#endregion
export { SingleStoreReal, SingleStoreRealBuilder, SingleStoreRealConfig, real };
//# sourceMappingURL=real.d.ts.map