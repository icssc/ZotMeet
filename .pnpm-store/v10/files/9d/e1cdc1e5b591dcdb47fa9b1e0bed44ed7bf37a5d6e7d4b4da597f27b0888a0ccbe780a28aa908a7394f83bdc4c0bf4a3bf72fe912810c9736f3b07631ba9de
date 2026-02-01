import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { Equal } from "../../utils.js";

//#region src/pg-core/columns/point.d.ts
declare class PgPointTupleBuilder extends PgColumnBuilder<{
  dataType: 'array point';
  data: [number, number];
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgPointTuple extends PgColumn<'array point'> {
  static readonly [entityKind]: string;
  readonly mode = "tuple";
  getSQLType(): string;
  mapFromDriverValue(value: string | {
    x: number;
    y: number;
  }): [number, number];
  mapToDriverValue(value: [number, number]): string;
}
declare class PgPointObjectBuilder extends PgColumnBuilder<{
  dataType: 'object point';
  data: {
    x: number;
    y: number;
  };
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgPointObject extends PgColumn<'object point'> {
  static readonly [entityKind]: string;
  readonly mode = "xy";
  getSQLType(): string;
  mapFromDriverValue(value: string | {
    x: number;
    y: number;
  }): {
    x: number;
    y: number;
  };
  mapToDriverValue(value: {
    x: number;
    y: number;
  }): string;
}
interface PgPointConfig<T extends 'tuple' | 'xy' = 'tuple' | 'xy'> {
  mode?: T;
}
declare function point<TMode extends PgPointConfig['mode'] & {}>(config?: PgPointConfig<TMode>): Equal<TMode, 'xy'> extends true ? PgPointObjectBuilder : PgPointTupleBuilder;
declare function point<TMode extends PgPointConfig['mode'] & {}>(name: string, config?: PgPointConfig<TMode>): Equal<TMode, 'xy'> extends true ? PgPointObjectBuilder : PgPointTupleBuilder;
//#endregion
export { PgPointConfig, PgPointObject, PgPointObjectBuilder, PgPointTuple, PgPointTupleBuilder, point };
//# sourceMappingURL=point.d.ts.map