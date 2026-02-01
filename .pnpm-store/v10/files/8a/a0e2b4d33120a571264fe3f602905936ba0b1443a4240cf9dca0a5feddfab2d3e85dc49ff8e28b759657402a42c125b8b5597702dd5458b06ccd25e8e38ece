import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
import { SingleStoreIntConfig } from "./int.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/mediumint.d.ts
declare class SingleStoreMediumIntBuilder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number uint24' : 'number int24';
  data: number;
  driverParam: number | string;
}, SingleStoreIntConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config?: SingleStoreIntConfig);
}
declare class SingleStoreMediumInt<T extends ColumnBaseConfig<'number int24' | 'number uint24'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreIntConfig> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function mediumint<TUnsigned extends boolean | undefined>(config?: SingleStoreIntConfig<TUnsigned>): SingleStoreMediumIntBuilder<TUnsigned>;
declare function mediumint<TUnsigned extends boolean | undefined>(name: string, config?: SingleStoreIntConfig<TUnsigned>): SingleStoreMediumIntBuilder<TUnsigned>;
//#endregion
export { SingleStoreMediumInt, SingleStoreMediumIntBuilder, mediumint };
//# sourceMappingURL=mediumint.d.cts.map