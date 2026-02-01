import { PgColumn, PgColumnBuilder } from "../common.cjs";
import { entityKind } from "../../../entity.cjs";

//#region src/pg-core/columns/vector_extension/vector.d.ts
declare class PgVectorBuilder extends PgColumnBuilder<{
  dataType: 'array vector';
  data: number[];
  driverParam: string;
}, {
  length: number;
  isLengthExact: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: PgVectorConfig);
}
declare class PgVector extends PgColumn<'array vector'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapToDriverValue(value: unknown): unknown;
  mapFromDriverValue(value: string): unknown;
}
interface PgVectorConfig {
  dimensions: number;
}
declare function vector(config: PgVectorConfig): PgVectorBuilder;
declare function vector(name: string, config: PgVectorConfig): PgVectorBuilder;
//#endregion
export { PgVector, PgVectorBuilder, PgVectorConfig, vector };
//# sourceMappingURL=vector.d.cts.map