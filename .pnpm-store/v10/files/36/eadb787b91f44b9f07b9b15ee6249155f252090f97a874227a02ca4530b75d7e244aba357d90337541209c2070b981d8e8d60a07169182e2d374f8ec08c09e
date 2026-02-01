import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mysql-core/columns/int.d.ts
declare class MySqlIntBuilder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number uint32' : 'number int32';
  data: number;
  driverParam: number | string;
}, MySqlIntConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config?: MySqlIntConfig);
}
declare class MySqlInt<T extends ColumnBaseConfig<'number int32' | 'number uint32'>> extends MySqlColumnWithAutoIncrement<T, MySqlIntConfig> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
interface MySqlIntConfig<TUnsigned extends boolean | undefined = boolean | undefined> {
  unsigned?: TUnsigned;
}
declare function int<TUnsigned extends boolean | undefined>(config?: MySqlIntConfig<TUnsigned>): MySqlIntBuilder<TUnsigned>;
declare function int<TUnsigned extends boolean | undefined>(name: string, config?: MySqlIntConfig): MySqlIntBuilder<TUnsigned>;
//#endregion
export { MySqlInt, MySqlIntBuilder, MySqlIntConfig, int };
//# sourceMappingURL=int.d.cts.map