import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";

//#region src/mysql-core/columns/float.d.ts
declare class MySqlFloatBuilder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number ufloat' : 'number float';
  data: number;
  driverParam: number | string;
}, MySqlFloatConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlFloatConfig | undefined);
}
declare class MySqlFloat<T extends ColumnBaseConfig<'number float' | 'number ufloat'>> extends MySqlColumnWithAutoIncrement<T, MySqlFloatConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  readonly unsigned: boolean | undefined;
  mapFromDriverValue(value: unknown): number;
  getSQLType(): string;
}
interface MySqlFloatConfig<TUnsigned extends boolean | undefined = boolean | undefined> {
  precision?: number;
  scale?: number;
  unsigned?: TUnsigned;
}
declare function float<TUnsigned extends boolean | undefined>(config?: MySqlFloatConfig<TUnsigned>): MySqlFloatBuilder<TUnsigned>;
declare function float<TUnsigned extends boolean | undefined>(name: string, config?: MySqlFloatConfig<TUnsigned>): MySqlFloatBuilder<TUnsigned>;
//#endregion
export { MySqlFloat, MySqlFloatBuilder, MySqlFloatConfig, float };
//# sourceMappingURL=float.d.ts.map