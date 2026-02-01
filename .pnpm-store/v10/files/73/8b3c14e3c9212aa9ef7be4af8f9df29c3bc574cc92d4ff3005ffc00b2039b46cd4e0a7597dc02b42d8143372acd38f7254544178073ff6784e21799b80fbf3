import { PgSequenceOptions } from "../sequence.cjs";
import { HasIdentity, PgColumnBuilder, PgColumnBuilderConfig } from "./common.cjs";
import { entityKind } from "../../entity.cjs";

//#region src/pg-core/columns/int.common.d.ts
declare abstract class PgIntColumnBuilder<out T extends PgColumnBuilderConfig = PgColumnBuilderConfig, out TRuntimeConfig extends object = object> extends PgColumnBuilder<T, TRuntimeConfig> {
  static readonly [entityKind]: string;
  /**
   * Adds an `ALWAYS AS IDENTITY` clause to the column definition.
   * Available for integer column types.
   */
  generatedAlwaysAsIdentity(sequence?: PgSequenceOptions & {
    name?: string;
  }): HasIdentity<this, 'always'>;
  /**
   * Adds a `BY DEFAULT AS IDENTITY` clause to the column definition.
   * Available for integer column types.
   */
  generatedByDefaultAsIdentity(sequence?: PgSequenceOptions & {
    name?: string;
  }): HasIdentity<this, 'byDefault'>;
}
//#endregion
export { PgIntColumnBuilder };
//# sourceMappingURL=int.common.d.cts.map