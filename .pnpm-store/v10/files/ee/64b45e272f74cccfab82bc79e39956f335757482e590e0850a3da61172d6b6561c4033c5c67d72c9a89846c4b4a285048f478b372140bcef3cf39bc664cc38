import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/uuid.d.ts
declare class PgUUIDBuilder extends PgColumnBuilder<{
  dataType: 'string uuid';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
  /**
   * Adds `default gen_random_uuid()` to the column definition.
   */
  defaultRandom(): ReturnType<this['default']>;
}
declare class PgUUID extends PgColumn<'string uuid'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function uuid(name?: string): PgUUIDBuilder;
//#endregion
export { PgUUID, PgUUIDBuilder, uuid };
//# sourceMappingURL=uuid.d.ts.map