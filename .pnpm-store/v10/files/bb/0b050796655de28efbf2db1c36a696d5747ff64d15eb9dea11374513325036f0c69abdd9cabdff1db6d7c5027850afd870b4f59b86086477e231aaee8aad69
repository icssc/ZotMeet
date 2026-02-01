import { MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";
import { MsSqlTable } from "../table.cjs";

//#region src/mssql-core/columns/bigint.d.ts
declare class MsSqlBigIntBuilder<TMode extends 'number' | 'bigint' | 'string'> extends MsSqlColumnBuilderWithIdentity<{
  dataType: TMode extends 'string' ? 'string int64' : TMode extends 'number' ? 'number int53' : 'bigint int64';
  data: TMode extends 'string' ? string : TMode extends 'number' ? number : bigint;
  driverParam: string;
}, MsSqlBigIntConfig> {
  static readonly [entityKind]: string;
  constructor(name: string, config: MsSqlBigIntConfig);
}
declare class MsSqlBigInt<T extends ColumnBaseConfig<'bigint int64' | 'number int53' | 'string int64'>> extends MsSqlColumnWithIdentity<T, MsSqlBigIntConfig> {
  static readonly [entityKind]: string;
  readonly mode: 'number' | 'bigint' | 'string';
  getSQLType(): string;
  constructor(table: MsSqlTable<any>, config: MsSqlBigIntBuilder<'string' | 'number' | 'bigint'>['config']);
  mapFromDriverValue(value: string): T['data'];
}
interface MsSqlBigIntConfig<T extends 'number' | 'bigint' | 'string' = 'number' | 'bigint' | 'string'> {
  mode: T;
}
declare function bigint<TMode extends 'number' | 'bigint' | 'string'>(config: MsSqlBigIntConfig<TMode>): MsSqlBigIntBuilder<TMode>;
declare function bigint<TMode extends 'number' | 'bigint' | 'string'>(name: string, config: MsSqlBigIntConfig<TMode>): MsSqlBigIntBuilder<TMode>;
//#endregion
export { MsSqlBigInt, MsSqlBigIntBuilder, bigint };
//# sourceMappingURL=bigint.d.cts.map