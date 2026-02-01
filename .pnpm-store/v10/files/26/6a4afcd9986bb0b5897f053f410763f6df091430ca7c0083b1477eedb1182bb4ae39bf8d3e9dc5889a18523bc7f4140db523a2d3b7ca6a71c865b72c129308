import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { RelativeDuration } from "gel";

//#region src/gel-core/columns/relative-duration.d.ts
declare class GelRelDurationBuilder extends GelColumnBuilder<{
  dataType: 'object relDuration';
  data: RelativeDuration;
  driverParam: RelativeDuration;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelRelDuration<T extends ColumnBaseConfig<'object relDuration'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function relDuration(name?: string): GelRelDurationBuilder;
//#endregion
export { GelRelDuration, GelRelDurationBuilder, relDuration };
//# sourceMappingURL=relative-duration.d.ts.map