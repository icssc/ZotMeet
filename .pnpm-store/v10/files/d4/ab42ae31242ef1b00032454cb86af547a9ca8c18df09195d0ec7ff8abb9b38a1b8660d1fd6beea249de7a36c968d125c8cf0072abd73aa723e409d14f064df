import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/int.d.ts
declare class SingleStoreIntBuilder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number uint32' : 'number int32';
  data: number;
  driverParam: number | string;
}, SingleStoreIntConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config?: SingleStoreIntConfig);
}
declare class SingleStoreInt<T extends ColumnBaseConfig<'number int32' | 'number uint32'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreIntConfig> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
interface SingleStoreIntConfig<TUnsigned extends boolean | undefined = boolean | undefined> {
  unsigned?: TUnsigned;
}
declare function int<TUnsigned extends boolean | undefined>(config?: SingleStoreIntConfig<TUnsigned>): SingleStoreIntBuilder<TUnsigned>;
declare function int<TUnsigned extends boolean | undefined>(name: string, config?: SingleStoreIntConfig<TUnsigned>): SingleStoreIntBuilder<TUnsigned>;
//#endregion
export { SingleStoreInt, SingleStoreIntBuilder, SingleStoreIntConfig, int };
//# sourceMappingURL=int.d.cts.map