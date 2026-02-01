import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
import { SingleStoreIntConfig } from "./int.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";

//#region src/singlestore-core/columns/smallint.d.ts
declare class SingleStoreSmallIntBuilder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number uint16' : 'number int16';
  data: number;
  driverParam: number | string;
}, SingleStoreIntConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config?: SingleStoreIntConfig);
}
declare class SingleStoreSmallInt<T extends ColumnBaseConfig<'number int16' | 'number uint16'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreIntConfig> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function smallint<TUnsigned extends boolean | undefined>(config?: SingleStoreIntConfig<TUnsigned>): SingleStoreSmallIntBuilder<TUnsigned>;
declare function smallint<TUnsigned extends boolean | undefined>(name: string, config?: SingleStoreIntConfig<TUnsigned>): SingleStoreSmallIntBuilder<TUnsigned>;
//#endregion
export { SingleStoreSmallInt, SingleStoreSmallIntBuilder, smallint };
//# sourceMappingURL=smallint.d.ts.map