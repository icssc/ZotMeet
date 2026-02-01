import { PgColumn, PgColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";

//#region src/pg-core/columns/bytea.d.ts
declare class PgByteaBuilder extends PgColumnBuilder<{
  dataType: 'object buffer';
  data: Buffer;
  driverParam: Buffer;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgBytea extends PgColumn<'object buffer'> {
  static readonly [entityKind]: string;
  mapFromDriverValue(value: Buffer | Uint8Array | string): Buffer;
  getSQLType(): string;
}
declare function bytea(name?: string): PgByteaBuilder;
//#endregion
export { PgBytea, PgByteaBuilder, bytea };
//# sourceMappingURL=bytea.d.cts.map