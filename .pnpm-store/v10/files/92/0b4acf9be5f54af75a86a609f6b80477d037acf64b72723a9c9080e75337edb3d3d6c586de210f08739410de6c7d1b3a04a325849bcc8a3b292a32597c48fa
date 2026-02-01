import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/year.d.ts
declare class SingleStoreYearBuilder extends SingleStoreColumnBuilder<{
  dataType: 'number year';
  data: number;
  driverParam: number;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SingleStoreYear<T extends ColumnBaseConfig<'number year'>> extends SingleStoreColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: unknown): number;
}
declare function year(name?: string): SingleStoreYearBuilder;
//#endregion
export { SingleStoreYear, SingleStoreYearBuilder, year };
//# sourceMappingURL=year.d.cts.map