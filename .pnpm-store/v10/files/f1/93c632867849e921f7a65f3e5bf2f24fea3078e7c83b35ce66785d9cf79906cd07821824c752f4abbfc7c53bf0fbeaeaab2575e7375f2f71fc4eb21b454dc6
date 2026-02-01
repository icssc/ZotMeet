import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mysql-core/columns/time.d.ts
declare class MySqlTimeBuilder extends MySqlColumnBuilder<{
  dataType: 'string time';
  data: string;
  driverParam: string | number;
}, TimeConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: TimeConfig | undefined);
}
declare class MySqlTime<T extends ColumnBaseConfig<'string time'>> extends MySqlColumn<T, TimeConfig> {
  static readonly [entityKind]: string;
  readonly fsp: number | undefined;
  getSQLType(): string;
  mapFromDriverValue(value: Date | string): string;
}
type TimeConfig = {
  fsp?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};
declare function time(config?: TimeConfig): MySqlTimeBuilder;
declare function time(name: string, config?: TimeConfig): MySqlTimeBuilder;
//#endregion
export { MySqlTime, MySqlTimeBuilder, TimeConfig, time };
//# sourceMappingURL=time.d.cts.map