import { MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/mssql-core/columns/float.d.ts
declare class MsSqlFloatBuilder extends MsSqlColumnBuilderWithIdentity<{
  dataType: 'number double';
  data: number;
  driverParam: number;
}, MsSqlFloatConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config?: MsSqlFloatConfig);
}
declare class MsSqlFloat<T extends ColumnBaseConfig<'number double'>> extends MsSqlColumnWithIdentity<T, MsSqlFloatConfig> {
  static readonly [entityKind]: string;
  readonly precision: number | undefined;
  getSQLType(): string;
}
interface MsSqlFloatConfig {
  precision?: number;
}
declare function float(config?: MsSqlFloatConfig): MsSqlFloatBuilder;
declare function float(name: string, config?: MsSqlFloatConfig): MsSqlFloatBuilder;
//#endregion
export { MsSqlFloat, MsSqlFloatBuilder, MsSqlFloatConfig, float };
//# sourceMappingURL=float.d.cts.map