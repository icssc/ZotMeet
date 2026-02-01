import { GelSequenceOptions } from "../sequence.cjs";
import { GelColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBuilderBaseConfig, ColumnType, GeneratedIdentityConfig, IsIdentity } from "../../column-builder.cjs";

//#region src/gel-core/columns/int.common.d.ts
declare abstract class GelIntColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnType>> extends GelColumnBuilder<T, {
  generatedIdentity: GeneratedIdentityConfig;
}> {
  static readonly [entityKind]: string;
  generatedAlwaysAsIdentity(sequence?: GelSequenceOptions & {
    name?: string;
  }): IsIdentity<this, 'always'>;
  generatedByDefaultAsIdentity(sequence?: GelSequenceOptions & {
    name?: string;
  }): IsIdentity<this, 'byDefault'>;
}
//#endregion
export { GelIntColumnBaseBuilder };
//# sourceMappingURL=int.common.d.cts.map