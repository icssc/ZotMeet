import { PgColumn, PgColumnBuilder } from "../common.js";
import { entityKind } from "../../../entity.js";

//#region src/pg-core/columns/vector_extension/bit.d.ts
declare class PgBinaryVectorBuilder extends PgColumnBuilder<{
  dataType: 'string binary';
  data: string;
  driverParam: string;
}, {
  length: number;
  isLengthExact: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: PgBinaryVectorConfig);
}
declare class PgBinaryVector extends PgColumn<'string binary'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
interface PgBinaryVectorConfig {
  dimensions: number;
}
declare function bit(config: PgBinaryVectorConfig): PgBinaryVectorBuilder;
declare function bit(name: string, config: PgBinaryVectorConfig): PgBinaryVectorBuilder;
//#endregion
export { PgBinaryVector, PgBinaryVectorBuilder, PgBinaryVectorConfig, bit };
//# sourceMappingURL=bit.d.ts.map