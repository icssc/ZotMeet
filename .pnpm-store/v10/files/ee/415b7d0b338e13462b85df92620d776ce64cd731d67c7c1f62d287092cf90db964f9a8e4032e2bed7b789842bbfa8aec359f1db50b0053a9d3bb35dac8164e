import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/mysql-core/columns/real.d.ts
declare class MySqlRealBuilder extends MySqlColumnBuilderWithAutoIncrement<{
  dataType: 'number double';
  data: number;
  driverParam: number | string;
}, MySqlRealConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MySqlRealConfig | undefined);
}
declare class MySqlReal<T extends ColumnBaseConfig<'number double'>> extends MySqlColumnWithAutoIncrement<T, MySqlRealConfig> {
  static readonly [entityKind]: string;
  precision: number | undefined;
  scale: number | undefined;
  getSQLType(): string;
}
interface MySqlRealConfig {
  precision?: number;
  scale?: number;
}
declare function real(config?: MySqlRealConfig): MySqlRealBuilder;
declare function real(name: string, config?: MySqlRealConfig): MySqlRealBuilder;
//#endregion
export { MySqlReal, MySqlRealBuilder, MySqlRealConfig, real };
//# sourceMappingURL=real.d.ts.map