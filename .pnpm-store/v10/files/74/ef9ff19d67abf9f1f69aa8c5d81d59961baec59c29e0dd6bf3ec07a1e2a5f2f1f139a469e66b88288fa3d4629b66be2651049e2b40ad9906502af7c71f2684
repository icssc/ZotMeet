import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.js";
import { Precision } from "./timestamp.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { CockroachTable } from "../table.js";

//#region src/cockroach-core/columns/time.d.ts
declare class CockroachTimeBuilder extends CockroachColumnWithArrayBuilder<{
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
declare class CockroachTime<T extends ColumnBaseConfig<'string time'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  readonly withTimezone: boolean;
  readonly precision: number | undefined;
  constructor(table: CockroachTable<any>, config: CockroachTimeBuilder['config']);
  getSQLType(): string;
}
interface TimeConfig {
  precision?: Precision;
  withTimezone?: boolean;
}
declare function time(config?: TimeConfig): CockroachTimeBuilder;
declare function time(name: string, config?: TimeConfig): CockroachTimeBuilder;
//#endregion
export { CockroachTime, CockroachTimeBuilder, TimeConfig, time };
//# sourceMappingURL=time.d.ts.map