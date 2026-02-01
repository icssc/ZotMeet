import { CockroachColumn } from "./common.cjs";
import { CockroachDateColumnBaseBuilder } from "./date.common.cjs";
import { entityKind } from "../../entity.cjs";
import { CockroachTable } from "../table.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/timestamp.d.ts
declare class CockroachTimestampBuilder extends CockroachDateColumnBaseBuilder<{
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
declare class CockroachTimestamp<T extends ColumnBaseConfig<'object date'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  readonly withTimezone: boolean;
  readonly precision: number | undefined;
  constructor(table: CockroachTable<any>, config: CockroachTimestampBuilder['config']);
  getSQLType(): string;
  mapFromDriverValue: (value: string) => Date | null;
  mapToDriverValue: (value: Date | string) => string;
}
declare class CockroachTimestampStringBuilder extends CockroachDateColumnBaseBuilder<{
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
declare class CockroachTimestampString<T extends ColumnBaseConfig<'string timestamp'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  readonly withTimezone: boolean;
  readonly precision: number | undefined;
  constructor(table: CockroachTable<any>, config: CockroachTimestampStringBuilder['config']);
  getSQLType(): string;
  mapToDriverValue: (value: Date | string) => string;
}
type Precision = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface CockroachTimestampConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
  mode?: TMode;
  precision?: Precision;
  withTimezone?: boolean;
}
declare function timestamp<TMode extends CockroachTimestampConfig['mode'] & {}>(config?: CockroachTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? CockroachTimestampStringBuilder : CockroachTimestampBuilder;
declare function timestamp<TMode extends CockroachTimestampConfig['mode'] & {}>(name: string, config?: CockroachTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? CockroachTimestampStringBuilder : CockroachTimestampBuilder;
//#endregion
export { CockroachTimestamp, CockroachTimestampBuilder, CockroachTimestampConfig, CockroachTimestampString, CockroachTimestampStringBuilder, Precision, timestamp };
//# sourceMappingURL=timestamp.d.cts.map