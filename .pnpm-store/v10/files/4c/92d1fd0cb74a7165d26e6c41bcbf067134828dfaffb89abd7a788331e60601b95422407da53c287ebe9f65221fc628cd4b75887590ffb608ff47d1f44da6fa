import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
import { MySqlIntConfig } from "./int.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";

//#region src/mysql-core/columns/mediumint.d.ts
declare class MySqlMediumIntBuilder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number uint24' : 'number int24';
  data: number;
  driverParam: number | string;
}, MySqlIntConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config?: MySqlIntConfig);
}
declare class MySqlMediumInt<T extends ColumnBaseConfig<'number int24' | 'number uint24'>> extends MySqlColumnWithAutoIncrement<T, MySqlIntConfig> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function mediumint<TUnsigned extends boolean | undefined>(config?: MySqlIntConfig<TUnsigned>): MySqlMediumIntBuilder<TUnsigned>;
declare function mediumint<TUnsigned extends boolean | undefined>(name: string, config?: MySqlIntConfig<TUnsigned>): MySqlMediumIntBuilder<TUnsigned>;
//#endregion
export { MySqlMediumInt, MySqlMediumIntBuilder, mediumint };
//# sourceMappingURL=mediumint.d.ts.map