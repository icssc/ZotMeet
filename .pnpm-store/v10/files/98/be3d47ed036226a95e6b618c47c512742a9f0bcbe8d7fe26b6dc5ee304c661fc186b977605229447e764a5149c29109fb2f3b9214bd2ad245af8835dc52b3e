import { PgDateColumnBuilder } from "./date.common.cjs";
import { PgColumn } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { PgTable } from "../table.cjs";

//#region src/pg-core/columns/timestamp.d.ts
declare class PgTimestampBuilder extends PgDateColumnBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string;
}, {
  withTimezone: boolean;
  precision: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, withTimezone: boolean, precision: number | undefined);
}
declare class PgTimestamp extends PgColumn<'object date'> {
  static readonly [entityKind]: string;
  readonly withTimezone: boolean;
  readonly precision: number | undefined;
  constructor(table: PgTable<any>, config: PgTimestampBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: Date | string): Date;
  mapToDriverValue(value: Date | string): string;
}
declare class PgTimestampStringBuilder extends PgDateColumnBuilder<{
  dataType: 'string timestamp';
  data: string;
  driverParam: string;
}, {
  withTimezone: boolean;
  precision: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, withTimezone: boolean, precision: number | undefined);
}
declare class PgTimestampString extends PgColumn<'string timestamp'> {
  static readonly [entityKind]: string;
  readonly withTimezone: boolean;
  readonly precision: number | undefined;
  constructor(table: PgTable<any>, config: PgTimestampStringBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue(value: Date | string): string;
  mapToDriverValue(value: Date | string): string;
}
type Precision = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface PgTimestampConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
  mode?: TMode;
  precision?: Precision;
  withTimezone?: boolean;
}
declare function timestamp<TMode extends PgTimestampConfig['mode'] & {}>(config?: PgTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? PgTimestampStringBuilder : PgTimestampBuilder;
declare function timestamp<TMode extends PgTimestampConfig['mode'] & {}>(name: string, config?: PgTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? PgTimestampStringBuilder : PgTimestampBuilder;
//#endregion
export { PgTimestamp, PgTimestampBuilder, PgTimestampConfig, PgTimestampString, PgTimestampStringBuilder, Precision, timestamp };
//# sourceMappingURL=timestamp.d.cts.map