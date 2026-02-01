import { CockroachColumnWithArrayBuilder } from "./common.cjs";
import { CockroachSequenceOptions } from "../sequence.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBuilderBaseConfig, ColumnType, GeneratedIdentityConfig, IsIdentity } from "../../column-builder.cjs";

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
//# sourceMappingURL=int.common.d.cts.map