import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/bigserial.d.ts
declare class PgBigSerial53Builder extends PgColumnBuilder<{
  dataType: 'number int53';
  data: number;
  driverParam: number;
  notNull: true;
  hasDefault: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgBigSerial53 extends PgColumn<'number int53'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: number): number;
}
declare class PgBigSerial64Builder extends PgColumnBuilder<{
  dataType: 'bigint int64';
  data: bigint;
  driverParam: string;
  notNull: true;
  hasDefault: true;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class PgBigSerial64 extends PgColumn<'bigint int64'> {
  static readonly [entityKind]: string;
  getSQLType(): string;
  mapFromDriverValue(value: string): bigint;
}
interface PgBigSerialConfig<T extends 'number' | 'bigint' = 'number' | 'bigint'> {
  mode: T;
}
declare function bigserial<TMode extends PgBigSerialConfig['mode']>(config: PgBigSerialConfig<TMode>): TMode extends 'number' ? PgBigSerial53Builder : PgBigSerial64Builder;
declare function bigserial<TMode extends PgBigSerialConfig['mode']>(name: string, config: PgBigSerialConfig<TMode>): TMode extends 'number' ? PgBigSerial53Builder : PgBigSerial64Builder;
//#endregion
export { PgBigSerial53, PgBigSerial53Builder, PgBigSerial64, PgBigSerial64Builder, PgBigSerialConfig, bigserial };
//# sourceMappingURL=bigserial.d.ts.map