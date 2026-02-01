import { CockroachColumn, CockroachColumnWithArrayBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/cockroach-core/columns/inet.d.ts
declare class CockroachInetBuilder extends CockroachColumnWithArrayBuilder<{
  dataType: 'string inet';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class CockroachInet<T extends ColumnBaseConfig<'string inet'>> extends CockroachColumn<T> {
  static readonly [entityKind]: string;
  getSQLType(): string;
}
declare function inet(name?: string): CockroachInetBuilder;
//#endregion
export { CockroachInet, CockroachInetBuilder, inet };
//# sourceMappingURL=inet.d.cts.map