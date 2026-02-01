import { PgDateColumnBuilder } from "./date.common.cjs";
import { Precision } from "./timestamp.cjs";
import { PgColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { PgTable } from "../table.cjs";

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
//# sourceMappingURL=time.d.cts.map