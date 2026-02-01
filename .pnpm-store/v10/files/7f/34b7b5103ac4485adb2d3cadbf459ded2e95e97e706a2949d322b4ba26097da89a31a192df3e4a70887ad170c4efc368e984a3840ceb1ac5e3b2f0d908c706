import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.cjs";
import { MySqlIntConfig } from "./int.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mysql-core/columns/smallint.d.ts
declare class MySqlSmallIntBuilder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number uint16' : 'number int16';
  data: number;
  driverParam: number | string;
}, MySqlIntConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config?: MySqlIntConfig);
}
declare class MySqlSmallInt<T extends ColumnBaseConfig<'number int16' | 'number uint16'>> extends MySqlColumnWithAutoIncrement<T, MySqlIntConfig> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function smallint<TUnsigned extends boolean | undefined>(config?: MySqlIntConfig<TUnsigned>): MySqlSmallIntBuilder<TUnsigned>;
declare function smallint<TUnsigned extends boolean | undefined>(name: string, config?: MySqlIntConfig<TUnsigned>): MySqlSmallIntBuilder<TUnsigned>;
//#endregion
export { MySqlSmallInt, MySqlSmallIntBuilder, smallint };
//# sourceMappingURL=smallint.d.cts.map