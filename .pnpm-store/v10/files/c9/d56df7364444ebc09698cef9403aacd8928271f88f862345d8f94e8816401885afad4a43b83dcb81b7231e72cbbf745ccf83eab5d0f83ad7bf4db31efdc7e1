import { PgColumnBuilder, PgColumnBuilderConfig, SetHasDefault } from "./common.cjs";
import { entityKind } from "../../entity.cjs";

//#region src/pg-core/columns/date.common.d.ts
declare abstract class PgDateColumnBuilder<out T extends PgColumnBuilderConfig = PgColumnBuilderConfig, out TRuntimeConfig extends object = object> extends PgColumnBuilder<T, TRuntimeConfig> {
  static readonly [entityKind]: string;
  /**
   * Adds a `default now()` clause to the column definition.
   * Available for date/time column types.
   */
  defaultNow(): SetHasDefault<this>;
}
//#endregion
export { PgDateColumnBuilder };
//# sourceMappingURL=date.common.d.cts.map