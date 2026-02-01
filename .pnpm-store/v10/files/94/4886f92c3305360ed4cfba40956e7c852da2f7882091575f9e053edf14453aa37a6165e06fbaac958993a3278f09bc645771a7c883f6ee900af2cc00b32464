import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/singlestore-core/columns/boolean.d.ts
declare class SingleStoreBooleanBuilder extends SingleStoreColumnBuilder<{
  dataType: 'boolean';
  data: boolean;
  driverParam: number | boolean;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SingleStoreBoolean<T extends ColumnBaseConfig<'boolean'>> extends SingleStoreColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | boolean): boolean;
}
declare function boolean(name?: string): SingleStoreBooleanBuilder;
//#endregion
export { SingleStoreBoolean, SingleStoreBooleanBuilder, boolean };
//# sourceMappingURL=boolean.d.ts.map