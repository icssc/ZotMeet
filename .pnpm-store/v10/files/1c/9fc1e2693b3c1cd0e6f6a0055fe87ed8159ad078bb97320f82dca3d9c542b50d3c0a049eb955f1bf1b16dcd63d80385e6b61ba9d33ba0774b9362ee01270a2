import { PgDateColumnBuilder } from "./date.common.js";
import { PgColumn } from "./common.js";
import { entityKind } from "../../entity.js";
import { Equal } from "../../utils.js";

//#region src/pg-core/columns/date.d.ts
declare class PgDateBuilder extends PgDateColumnBuilder<{
  dataType: 'object date';
  data: Date;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgDate extends PgColumn<'object date'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string | Date): Date;
  mapToDriverValue(value: Date | string): string;
}
declare class PgDateStringBuilder extends PgDateColumnBuilder<{
  dataType: 'string date';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgDateString extends PgColumn<'string date'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: Date | string): string;
  mapToDriverValue(value: Date | string): string;
}
interface PgDateConfig<T extends 'date' | 'string' = 'date' | 'string'> {
  mode: T;
}
declare function date<TMode extends PgDateConfig['mode'] & {}>(config?: PgDateConfig<TMode>): Equal<TMode, 'date'> extends true ? PgDateBuilder : PgDateStringBuilder;
declare function date<TMode extends PgDateConfig['mode'] & {}>(name: string, config?: PgDateConfig<TMode>): Equal<TMode, 'date'> extends true ? PgDateBuilder : PgDateStringBuilder;
//#endregion
export { PgDate, PgDateBuilder, PgDateConfig, PgDateString, PgDateStringBuilder, date };
//# sourceMappingURL=date.d.ts.map