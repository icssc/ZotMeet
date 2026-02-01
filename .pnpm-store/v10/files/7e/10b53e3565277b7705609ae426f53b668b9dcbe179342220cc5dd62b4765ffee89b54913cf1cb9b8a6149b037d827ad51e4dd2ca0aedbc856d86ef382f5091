import { PgColumn, PgColumnBaseConfig, PgColumnBuilder } from "../common.cjs";
import { entityKind } from "../../../entity.cjs";

//#region src/pg-core/columns/vector_extension/sparsevec.d.ts
declare class PgSparseVectorBuilder extends PgColumnBuilder<{
  dataType: 'string sparsevec';
  data: string;
  driverParam: string;
}, {
  vectorDimensions: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, config: PgSparseVectorConfig);
}
declare class PgSparseVector extends PgColumn<'string sparsevec', PgColumnBaseConfig<'string sparsevec'>, {
  vectorDimensions: number | undefined;
}> {
  static readonly [entityKind]: string;
  readonly vectorDimensions: number | undefined;
  getSQLType(): string;
}
interface PgSparseVectorConfig {
  dimensions: number;
}
declare function sparsevec(config: PgSparseVectorConfig): PgSparseVectorBuilder;
declare function sparsevec(name: string, config: PgSparseVectorConfig): PgSparseVectorBuilder;
//#endregion
export { PgSparseVector, PgSparseVectorBuilder, PgSparseVectorConfig, sparsevec };
//# sourceMappingURL=sparsevec.d.cts.map