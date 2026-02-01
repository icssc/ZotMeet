import { CockroachColumn } from "./common.cjs";
import { CockroachDateColumnBaseBuilder } from "./date.common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/date.d.ts
declare class CockroachDateBuilder extends CockroachDateColumnBaseBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class CockroachDate<T extends ColumnBaseConfig<'object date'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string): Date;
  mapToDriverValue(value: Date | string): string;
}
declare class CockroachDateStringBuilder extends CockroachDateColumnBaseBuilder<{
  dataType: 'string date';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class CockroachDateString<T extends ColumnBaseConfig<'string date'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapToDriverValue(value: Date | string): string;
}
interface CockroachDateConfig<T extends 'date' | 'string' = 'date' | 'string'> {
  mode: T;
}
declare function date<TMode extends CockroachDateConfig['mode'] & {}>(config?: CockroachDateConfig<TMode>): Equal<TMode, 'date'> extends true ? CockroachDateBuilder : CockroachDateStringBuilder;
declare function date<TMode extends CockroachDateConfig['mode'] & {}>(name: string, config?: CockroachDateConfig<TMode>): Equal<TMode, 'date'> extends true ? CockroachDateBuilder : CockroachDateStringBuilder;
//#endregion
export { CockroachDate, CockroachDateBuilder, CockroachDateConfig, CockroachDateString, CockroachDateStringBuilder, date };
//# sourceMappingURL=date.d.cts.map