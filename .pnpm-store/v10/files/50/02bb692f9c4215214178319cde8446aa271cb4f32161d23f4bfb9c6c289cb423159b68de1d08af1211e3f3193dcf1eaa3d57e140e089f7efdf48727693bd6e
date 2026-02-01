import { PgDateColumnBuilder } from "./date.common.js";
import { Precision } from "./timestamp.js";
import { PgColumn } from "./common.js";
import { entityKind } from "../../entity.js";
import { PgTable } from "../table.js";

//#region src/pg-core/columns/time.d.ts
declare class PgTimeBuilder extends PgDateColumnBuilder<{
  dataType: 'string time';
  data: string;
  driverParam: string;
}, {
  withTimezone: boolean;
  precision: number | undefined;
}> {
  readonly withTimezone: boolean;
  readonly precision: number | undefined;
  static readonly [entityKind]: string;
  constructor(name: string, withTimezone: boolean, precision: number | undefined);
}
declare class PgTime extends PgColumn<'string time'> {
  static readonly [entityKind]: string;
  readonly withTimezone: boolean;
  readonly precision: number | undefined;
  constructor(table: PgTable<any>, config: PgTimeBuilder['config']);
  getSQLType(): string;
}
interface TimeConfig {
  precision?: Precision;
  withTimezone?: boolean;
}
declare function time(config?: TimeConfig): PgTimeBuilder;
declare function time(name: string, config?: TimeConfig): PgTimeBuilder;
//#endregion
export { PgTime, PgTimeBuilder, TimeConfig, time };
//# sourceMappingURL=time.d.ts.map