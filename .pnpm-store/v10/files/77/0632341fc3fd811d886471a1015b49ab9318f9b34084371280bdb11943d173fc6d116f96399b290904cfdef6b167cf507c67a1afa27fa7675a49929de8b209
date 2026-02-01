import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
import { SingleStoreIntConfig } from "./int.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/tinyint.d.ts
declare class SingleStoreTinyIntBuilder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number uint8' : 'number int8';
  data: number;
  driverParam: number | string;
}, SingleStoreIntConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config?: SingleStoreIntConfig);
}
declare class SingleStoreTinyInt<T extends ColumnBaseConfig<'number int8' | 'number uint8'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreIntConfig> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function tinyint<TUnsigned extends boolean | undefined>(config?: SingleStoreIntConfig<TUnsigned>): SingleStoreTinyIntBuilder<TUnsigned>;
declare function tinyint<TUnsigned extends boolean | undefined>(name: string, config?: SingleStoreIntConfig<TUnsigned>): SingleStoreTinyIntBuilder<TUnsigned>;
//#endregion
export { SingleStoreTinyInt, SingleStoreTinyIntBuilder, tinyint };
//# sourceMappingURL=tinyint.d.cts.map