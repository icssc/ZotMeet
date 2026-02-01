import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/cockroach-core/columns/varbit.d.ts
declare class CockroachVarbitBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'string binary';
  data: string;
  driverParam: string;
}, {
  length: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: CockroachVarbitConfig);
}
declare class CockroachVarbit<T extends ColumnBaseConfig<'string binary'>> extends CockroachColumn<T, {
  length: number | undefined;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
interface CockroachVarbitConfig {
  length?: number | undefined;
}
declare function varbit(config?: CockroachVarbitConfig): CockroachVarbitBuilder;
declare function varbit(name: string, config?: CockroachVarbitConfig): CockroachVarbitBuilder;
//#endregion
export { CockroachVarbit, CockroachVarbitBuilder, CockroachVarbitConfig, varbit };
//# sourceMappingURL=varbit.d.ts.map