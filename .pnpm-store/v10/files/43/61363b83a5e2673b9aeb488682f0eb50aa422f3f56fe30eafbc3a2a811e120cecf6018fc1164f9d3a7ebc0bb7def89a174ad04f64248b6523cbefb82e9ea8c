import { GelSequenceOptions } from "../sequence.js";
import { GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBuilderBaseConfig, ColumnType, GeneratedIdentityConfig, IsIdentity } from "../../column-builder.js";

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
//# sourceMappingURL=int.common.d.ts.map