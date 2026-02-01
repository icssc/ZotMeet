import { PgColumn, PgColumnBuilder } from "../common.js";
import { entityKind } from "../../../entity.js";

//#region src/pg-core/columns/vector_extension/halfvec.d.ts
declare class PgHalfVectorBuilder extends PgColumnBuilder<{
  dataType: 'array halfvector';
  data: number[];
  driverParam: string;
}, {
  length: number;
  isLengthExact: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: PgHalfVectorConfig);
}
declare class PgHalfVector extends PgColumn<'array halfvector'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapToDriverValue(value: unknown): unknown;
  mapFromDriverValue(value: string): unknown;
}
interface PgHalfVectorConfig {
  dimensions: number;
}
declare function halfvec(config: PgHalfVectorConfig): PgHalfVectorBuilder;
declare function halfvec(name: string, config: PgHalfVectorConfig): PgHalfVectorBuilder;
//#endregion
export { PgHalfVector, PgHalfVectorBuilder, PgHalfVectorConfig, halfvec };
//# sourceMappingURL=halfvec.d.ts.map