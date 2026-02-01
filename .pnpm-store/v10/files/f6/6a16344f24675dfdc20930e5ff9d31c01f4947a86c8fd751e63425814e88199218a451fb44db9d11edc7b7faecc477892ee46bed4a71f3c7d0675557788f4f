import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";
import { Equal } from "../../utils.js";

//#region src/mysql-core/columns/double.d.ts
declare class MySqlDoubleBuilder<TUnsigned extends boolean | undefined> extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: Equal<TUnsigned, true> extends true ? 'number udouble' : 'number double';
  data: number;
  driverParam: number | string;
}, MySqlDoubleConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlDoubleConfig | undefined);
}
declare class MySqlDouble<T extends ColumnBaseConfig<'number double' | 'number udouble'>> extends MySqlColumnWithAutoIncrement<T, MySqlDoubleConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  readonly scale: number | undefined;
  readonly unsigned: boolean | undefined;
  getSQLType(): string;
}
interface MySqlDoubleConfig<TUnsigned extends boolean | undefined = boolean | undefined> {
  precision?: number;
  scale?: number;
  unsigned?: TUnsigned;
}
declare function double<TUnsigned extends boolean | undefined>(config?: MySqlDoubleConfig<TUnsigned>): MySqlDoubleBuilder<TUnsigned>;
declare function double<TUnsigned extends boolean | undefined>(name: string, config?: MySqlDoubleConfig<TUnsigned>): MySqlDoubleBuilder<TUnsigned>;
//#endregion
export { MySqlDouble, MySqlDoubleBuilder, MySqlDoubleConfig, double };
//# sourceMappingURL=double.d.ts.map