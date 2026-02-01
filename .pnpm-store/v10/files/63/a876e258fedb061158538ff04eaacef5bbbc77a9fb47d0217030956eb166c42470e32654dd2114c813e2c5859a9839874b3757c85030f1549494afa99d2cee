import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/bool.d.ts
declare class CockroachBooleanBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'boolean';
  data: boolean;
  driverParam: boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class CockroachBoolean<T extends ColumnBaseConfig<'boolean'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function bool(name?: string): CockroachBooleanBuilder;
declare const boolean: typeof bool;
//#endregion
export { CockroachBoolean, CockroachBooleanBuilder, bool, boolean };
//# sourceMappingURL=bool.d.cts.map