import { CockroachColumn } from "./common.js";
import { CockroachIntColumnBaseBuilder } from "./int.common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/cockroach-core/columns/smallint.d.ts
declare class CockroachSmallIntBuilder extends CockroachIntColumnBaseBuilder<{
  dataType: 'number int16';
  data: number;
  driverParam: number | string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class CockroachSmallInt<T extends ColumnBaseConfig<'number int16'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue: (value: number | string) => number;
}
declare function smallint(name?: string): CockroachSmallIntBuilder;
declare function int2(name?: string): CockroachSmallIntBuilder;
//#endregion
export { CockroachSmallInt, CockroachSmallIntBuilder, int2, smallint };
//# sourceMappingURL=smallint.d.ts.map