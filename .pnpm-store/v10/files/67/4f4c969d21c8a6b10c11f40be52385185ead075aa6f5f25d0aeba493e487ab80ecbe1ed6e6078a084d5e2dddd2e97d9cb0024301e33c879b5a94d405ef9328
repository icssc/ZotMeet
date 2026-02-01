import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/singlestore-core/columns/serial.d.ts
declare class SingleStoreSerialBuilder extends SingleStoreColumnBuilderWithAutoIncrement<{
  dataType: 'number uint53';
  data: number;
  driverParam: number;
  isPrimaryKey: true;
  hasDefault: true;
  notNull: true;
  isAutoincrement: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class SingleStoreSerial<T extends ColumnBaseConfig<'number uint53'>> extends SingleStoreColumnWithAutoIncrement<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number | string): number;
}
declare function serial(name?: string): SingleStoreSerialBuilder;
//#endregion
export { SingleStoreSerial, SingleStoreSerialBuilder, serial };
//# sourceMappingURL=serial.d.cts.map