import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { Equal } from "../../utils.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/geometry.d.ts
declare class CockroachGeometryBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'array geometry';
  data: [number, number];
  driverParam: string;
}, {
  srid: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, srid?: number);
}
declare class CockroachGeometry<T extends ColumnBaseConfig<'array geometry'>> extends CockroachColumn<T, {
  srid: number | undefined;
}> {
  static readonly [entityKind]: string;
  readonly srid: number | undefined;
  readonly mode = "tuple";
  getSQLType(): string;
  mapFromDriverValue(value: string | [number, number]): [number, number];
  mapToDriverValue(value: [number, number]): string;
}
declare class CockroachGeometryObjectBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'object geometry';
  data: {
    x: number;
    y: number;
  };
  driverParam: string;
}, {
  srid?: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, srid: number | undefined);
}
declare class CockroachGeometryObject<T extends ColumnBaseConfig<'object geometry'>> extends CockroachColumn<T, {
  srid: number | undefined;
}> {
  static readonly [entityKind]: string;
  readonly srid: number | undefined;
  readonly mode = "object";
  getSQLType(): string;
  mapFromDriverValue(value: string): {
    x: number;
    y: number;
  };
  mapToDriverValue(value: {
    x: number;
    y: number;
  }): string;
}
interface CockroachGeometryConfig<T extends 'tuple' | 'xy' = 'tuple' | 'xy'> {
  mode?: T;
  type?: 'point' | (string & {});
  srid?: number;
}
declare function geometry<TMode extends CockroachGeometryConfig['mode'] & {}>(config?: CockroachGeometryConfig<TMode>): Equal<TMode, 'xy'> extends true ? CockroachGeometryObjectBuilder : CockroachGeometryBuilder;
declare function geometry<TMode extends CockroachGeometryConfig['mode'] & {}>(name: string, config?: CockroachGeometryConfig<TMode>): Equal<TMode, 'xy'> extends true ? CockroachGeometryObjectBuilder : CockroachGeometryBuilder;
//#endregion
export { CockroachGeometry, CockroachGeometryBuilder, CockroachGeometryConfig, CockroachGeometryObject, CockroachGeometryObjectBuilder, geometry };
//# sourceMappingURL=geometry.d.cts.map