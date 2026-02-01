import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { ColumnBaseConfig } from "../../column.js";

//#region src/cockroach-core/columns/uuid.d.ts
declare class CockroachUUIDBuilder extends CockroachColumnWithArrayBuilder<{
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
declare class CockroachUUID<T extends ColumnBaseConfig<'string uuid'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function uuid(name?: string): CockroachUUIDBuilder;
//#endregion
export { CockroachUUID, CockroachUUIDBuilder, uuid };
//# sourceMappingURL=uuid.d.ts.map