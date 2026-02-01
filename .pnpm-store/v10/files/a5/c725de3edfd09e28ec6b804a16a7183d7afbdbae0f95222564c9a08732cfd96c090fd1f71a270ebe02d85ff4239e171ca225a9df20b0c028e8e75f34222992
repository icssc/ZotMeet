import { PgColumn, PgColumnBaseConfig, PgColumnBuilder } from "../common.cjs";
import { entityKind } from "../../../entity.cjs";
import { Equal } from "../../../utils.cjs";

//#region src/pg-core/columns/postgis_extension/geometry.d.ts
declare class PgGeometryBuilder extends PgColumnBuilder<{
  dataType: 'array geometry';
  data: [number, number];
  driverParam: string;
}, {
  srid: number | undefined;
}> {
  static readonly [entityKind]: string;
  constructor(name: string, srid?: number);
}
declare class PgGeometry extends PgColumn<'array geometry', PgColumnBaseConfig<'array geometry'>, {
  srid: number | undefined;
}> {
  static readonly [entityKind]: string;
  readonly srid: number | undefined;
  readonly mode = "tuple";
  getSQLType(): string;
  mapFromDriverValue(value: string | [number, number]): [number, number];
  mapToDriverValue(value: [number, number]): string;
}
declare class PgGeometryObjectBuilder extends PgColumnBuilder<{
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
declare class PgGeometryObject extends PgColumn<'object geometry', PgColumnBaseConfig<'object geometry'>, {
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
interface PgGeometryConfig<T extends 'tuple' | 'xy' = 'tuple' | 'xy'> {
  mode?: T;
  type?: 'point' | (string & {});
  srid?: number;
}
declare function geometry<TMode extends PgGeometryConfig['mode'] & {}>(config?: PgGeometryConfig<TMode>): Equal<TMode, 'xy'> extends true ? PgGeometryObjectBuilder : PgGeometryBuilder;
declare function geometry<TMode extends PgGeometryConfig['mode'] & {}>(name: string, config?: PgGeometryConfig<TMode>): Equal<TMode, 'xy'> extends true ? PgGeometryObjectBuilder : PgGeometryBuilder;
//#endregion
export { PgGeometry, PgGeometryBuilder, PgGeometryConfig, PgGeometryObject, PgGeometryObjectBuilder, geometry };
//# sourceMappingURL=geometry.d.cts.map