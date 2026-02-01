import { GelColumn, GelColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/gel-core/columns/uuid.d.ts
declare class GelUUIDBuilder extends GelColumnBuilder<{
  dataType: 'string uuid';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelUUID<T extends ColumnBaseConfig<'string uuid'>> extends GelColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function uuid(name?: string): GelUUIDBuilder;
//#endregion
export { GelUUID, GelUUIDBuilder, uuid };
//# sourceMappingURL=uuid.d.cts.map