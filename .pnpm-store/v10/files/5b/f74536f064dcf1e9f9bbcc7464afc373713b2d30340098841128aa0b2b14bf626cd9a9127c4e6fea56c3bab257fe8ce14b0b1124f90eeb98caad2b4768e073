import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { Equal } from "../../utils.js";

//#region src/pg-core/columns/line.d.ts
declare class PgLineBuilder extends PgColumnBuilder<{
  dataType: 'array line';
  data: [number, number, number];
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgLineTuple extends PgColumn<'array line'> {
  static readonly [entityKind]: string;
  readonly mode = "tuple";
  getSQLType(): string;
  mapFromDriverValue(value: string): [number, number, number];
  mapToDriverValue(value: [number, number, number]): string;
}
declare class PgLineABCBuilder extends PgColumnBuilder<{
  dataType: 'object line';
  data: {
    a: number;
    b: number;
    c: number;
  };
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgLineABC extends PgColumn<'object line'> {
  static readonly [entityKind]: string;
  readonly mode = "abc";
  getSQLType(): string;
  mapFromDriverValue(value: string): {
    a: number;
    b: number;
    c: number;
  };
  mapToDriverValue(value: {
    a: number;
    b: number;
    c: number;
  }): string;
}
interface PgLineTypeConfig<T extends 'tuple' | 'abc' = 'tuple' | 'abc'> {
  mode?: T;
}
declare function line<TMode extends PgLineTypeConfig['mode'] & {}>(config?: PgLineTypeConfig<TMode>): Equal<TMode, 'abc'> extends true ? PgLineABCBuilder : PgLineBuilder;
declare function line<TMode extends PgLineTypeConfig['mode'] & {}>(name: string, config?: PgLineTypeConfig<TMode>): Equal<TMode, 'abc'> extends true ? PgLineABCBuilder : PgLineBuilder;
//#endregion
export { PgLineABC, PgLineABCBuilder, PgLineBuilder, PgLineTuple, PgLineTypeConfig, line };
//# sourceMappingURL=line.d.ts.map