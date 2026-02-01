import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.js";
import { Precision } from "./timestamp.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/cockroach-core/columns/interval.d.ts
declare class CockroachIntervalBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'string interval';
  data: string;
  driverParam: string;
}, {
  intervalConfig: IntervalConfig;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, intervalConfig: IntervalConfig);
}
declare class CockroachInterval<T extends ColumnBaseConfig<'string interval'>> extends CockroachColumn<T, {
  intervalConfig: IntervalConfig;
}> {
  static readonly [entityKind]: string;
  readonly fields: IntervalConfig['fields'];
  readonly precision: IntervalConfig['precision'];
  getSQLType(): string;
}
interface IntervalConfig {
  fields?: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'year to month' | 'day to hour' | 'day to minute' | 'day to second' | 'hour to minute' | 'hour to second' | 'minute to second';
  precision?: Precision;
}
declare function interval(config?: IntervalConfig): CockroachIntervalBuilder;
declare function interval(name: string, config?: IntervalConfig): CockroachIntervalBuilder;
//#endregion
export { CockroachInterval, CockroachIntervalBuilder, IntervalConfig, interval };
//# sourceMappingURL=interval.d.ts.map