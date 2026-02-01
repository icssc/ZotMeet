import { Precision } from "./timestamp.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { PgTable } from "../table.cjs";

//#region src/pg-core/columns/interval.d.ts
declare class PgIntervalBuilder extends PgColumnBuilder<{
  dataType: 'string interval';
  data: string;
  driverParam: string;
}, {
  intervalConfig: IntervalConfig;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, intervalConfig: IntervalConfig);
}
declare class PgInterval extends PgColumn<'string interval'> {
  static readonly [entityKind]: string;
  readonly fields: IntervalConfig['fields'];
  readonly precision: IntervalConfig['precision'];
  constructor(table: PgTable<any>, config: PgIntervalBuilder['config']);
  getSQLType(): string;
}
interface IntervalConfig {
  fields?: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'year to month' | 'day to hour' | 'day to minute' | 'day to second' | 'hour to minute' | 'hour to second' | 'minute to second';
  precision?: Precision;
}
declare function interval(config?: IntervalConfig): PgIntervalBuilder;
declare function interval(name: string, config?: IntervalConfig): PgIntervalBuilder;
//#endregion
export { IntervalConfig, PgInterval, PgIntervalBuilder, interval };
//# sourceMappingURL=interval.d.cts.map