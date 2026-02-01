import { CockroachColumn, CockroachColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/vector.d.ts
declare class CockroachVectorBuilder extends CockroachColumnBuilder<{
  dataType: 'array vector';
  data: number[];
  driverParam: string;
}, {
  length: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: CockroachVectorConfig);
}
declare class CockroachVector<T extends ColumnBaseConfig<'array vector'>> extends CockroachColumn<T, {
  length: number;
}> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapToDriverValue(value: unknown): unknown;
  mapFromDriverValue(value: string): unknown;
}
interface CockroachVectorConfig {
  dimensions: number;
}
declare function vector(config: CockroachVectorConfig): CockroachVectorBuilder;
declare function vector(name: string, config: CockroachVectorConfig): CockroachVectorBuilder;
//#endregion
export { CockroachVector, CockroachVectorBuilder, CockroachVectorConfig, vector };
//# sourceMappingURL=vector.d.cts.map