import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/time.d.ts
declare class SingleStoreTimeBuilder extends SingleStoreColumnBuilder<{
  dataType: 'string time';
  data: string;
  driverParam: string | number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SingleStoreTime<T extends ColumnBaseConfig<'string time'>> extends SingleStoreColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function time(name?: string): SingleStoreTimeBuilder;
//#endregion
export { SingleStoreTime, SingleStoreTimeBuilder, time };
//# sourceMappingURL=time.d.cts.map