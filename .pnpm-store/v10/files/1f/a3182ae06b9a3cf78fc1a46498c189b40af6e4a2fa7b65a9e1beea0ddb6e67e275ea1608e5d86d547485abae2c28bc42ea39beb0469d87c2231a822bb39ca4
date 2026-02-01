import { CockroachColumnWithArrayBuilder } from "./common.js";
import { CockroachSequenceOptions } from "../sequence.js";
import { entityKind } from "../../entity.js";
import { ColumnBuilderBaseConfig, ColumnType, GeneratedIdentityConfig, IsIdentity } from "../../column-builder.js";

//#region src/cockroach-core/columns/int.common.d.ts
declare abstract class CockroachIntColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnType>> extends CockroachColumnWithArrayBuilder<T, {
  generatedIdentity: GeneratedIdentityConfig;
}> {
  static readonly [entityKind]: string;
  generatedAlwaysAsIdentity(sequence?: CockroachSequenceOptions): IsIdentity<this, 'always'>;
  generatedByDefaultAsIdentity(sequence?: CockroachSequenceOptions): IsIdentity<this, 'byDefault'>;
}
//#endregion
export { CockroachIntColumnBaseBuilder };
//# sourceMappingURL=int.common.d.ts.map