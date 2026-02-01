import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/float.d.ts
declare class SingleStoreFloatBuilder<TUnsigned extends boolean | undefined> extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number ufloat' : 'number float';
  data: number;
  driverParam: number | string;
}, SingleStoreFloatConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: SingleStoreFloatConfig | undefined);
}
declare class SingleStoreFloat<T extends ColumnBaseConfig<'number float' | 'number ufloat'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreFloatConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  readonly unsigned: boolean | undefined;
  getSQLType(): string;
  mapFromDriverValue(value: unknown): number;
}
interface SingleStoreFloatConfig<TUnsigned extends boolean | undefined = boolean | undefined> {
  precision?: number;
  scale?: number;
  unsigned?: TUnsigned;
}
declare function float<TUnsigned extends boolean | undefined>(config?: SingleStoreFloatConfig<TUnsigned>): SingleStoreFloatBuilder<TUnsigned>;
declare function float<TUnsigned extends boolean | undefined>(name: string, config?: SingleStoreFloatConfig<TUnsigned>): SingleStoreFloatBuilder<TUnsigned>;
//#endregion
export { SingleStoreFloat, SingleStoreFloatBuilder, SingleStoreFloatConfig, float };
//# sourceMappingURL=float.d.cts.map