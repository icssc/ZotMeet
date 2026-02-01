import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/bit.d.ts
declare class CockroachBitBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'string binary';
  data: string;
  driverParam: string;
}, {
  length: number | undefined;
  setLength: boolean;
  isLengthExact: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: CockroachBitConfig);
}
declare class CockroachBit<T extends ColumnBaseConfig<'string binary'> & {
  length?: number;
}> extends CockroachColumn<T, {
  length: T['length'];
  setLength: boolean;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
interface CockroachBitConfig {
  length?: number | undefined;
}
declare function bit(config?: CockroachBitConfig): CockroachBitBuilder;
declare function bit(name: string, config?: CockroachBitConfig): CockroachBitBuilder;
//#endregion
export { CockroachBit, CockroachBitBuilder, CockroachBitConfig, bit };
//# sourceMappingURL=bit.d.cts.map