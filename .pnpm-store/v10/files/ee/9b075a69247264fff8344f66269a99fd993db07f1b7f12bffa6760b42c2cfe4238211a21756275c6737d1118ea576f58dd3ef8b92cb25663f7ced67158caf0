import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";

//#region src/singlestore-core/columns/double.d.ts
declare class SingleStoreDoubleBuilder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number udouble' : 'number double';
  data: number;
  driverParam: number | string;
}, SingleStoreDoubleConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: SingleStoreDoubleConfig | undefined);
}
declare class SingleStoreDouble<T extends ColumnBaseConfig<'number double' | 'number udouble'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreDoubleConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  readonly unsigned: boolean | undefined;
  getSQLType(): string;
}
interface SingleStoreDoubleConfig<TUnsigned extends boolean | undefined = boolean | undefined> {
  precision?: number;
  scale?: number;
  unsigned?: TUnsigned;
}
declare function double<TUnsigned extends boolean | undefined>(config?: SingleStoreDoubleConfig<TUnsigned>): SingleStoreDoubleBuilder<TUnsigned>;
declare function double<TUnsigned extends boolean | undefined>(name: string, config?: SingleStoreDoubleConfig<TUnsigned>): SingleStoreDoubleBuilder<TUnsigned>;
//#endregion
export { SingleStoreDouble, SingleStoreDoubleBuilder, SingleStoreDoubleConfig, double };
//# sourceMappingURL=double.d.ts.map