import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.cjs";
import { MySqlIntConfig } from "./int.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mysql-core/columns/tinyint.d.ts
declare class MySqlTinyIntBuilder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number uint8' : 'number int8';
  data: number;
  driverParam: number | string;
}, MySqlIntConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config?: MySqlIntConfig);
}
declare class MySqlTinyInt<T extends ColumnBaseConfig<'number int8' | 'number uint8'>> extends MySqlColumnWithAutoIncrement<T, MySqlIntConfig> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function tinyint<TUnsigned extends boolean | undefined>(config?: MySqlIntConfig<TUnsigned>): MySqlTinyIntBuilder<TUnsigned>;
declare function tinyint<TUnsigned extends boolean | undefined>(name: string, config?: MySqlIntConfig<TUnsigned>): MySqlTinyIntBuilder<TUnsigned>;
//#endregion
export { MySqlTinyInt, MySqlTinyIntBuilder, tinyint };
//# sourceMappingURL=tinyint.d.cts.map